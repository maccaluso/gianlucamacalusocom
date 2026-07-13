'use client'

import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { SimplexNoise } from 'three-stdlib'

import styles from './strandCluster.module.css'

// Prototype background inspired by Can Buyukberber's "Hyperconnected" stills:
// a dense core of varying-size spheres with flowing strand lines fanning
// outward, like a comet or a murmuration, in a near-monochrome palette.
// Strands wave like tentacles: anchored at the core, whipping more freely
// towards their tips, and particles ride along the same motion.
const STRAND_COUNT = 36
const CORE_RADIUS = 0.4
const SPHERE_COLORS = ['#ffff00', '#00ffff']
const PARTICLES_MIN = 12
const PARTICLES_MAX = 32
const CURVE_SAMPLES = 40
const WAVE_AMPLITUDE_MIN = 0.25
const WAVE_AMPLITUDE_MAX = 0.85
const WAVE_FREQUENCY = 3.5
const WAVE_SPEED_MIN = 0.5
const WAVE_SPEED_MAX = 2
const MAX_SIZE = 0.14
const TRAVEL_SPEED_MIN = 0.06
const TRAVEL_SPEED_MAX = 0.16
const DRIFT_SPEED_MIN = 0.25
const DRIFT_SPEED_MAX = 0.7
const DRIFT_DURATION_MIN = 2.5
const DRIFT_DURATION_MAX = 5.5
const PETAL_COUNT = 320
const PETAL_DETACH_SPEED = 0.6
const PETAL_GUST_DETACH_SPEED = 0.08
const PETAL_GUST_DURATION = 1.4
const GUST_INTERVAL_MIN = 20
const GUST_INTERVAL_MAX = 40
const PETAL_SIZE_MIN = 0.08
const PETAL_SIZE_MAX = 0.16
const PETAL_FALL_SPEED = 0.15
const PETAL_SWAY_AMPLITUDE = 0.3
const PETAL_SWAY_FREQUENCY = 1.5
const PETAL_DRIFT_DURATION_MIN = 4
const PETAL_DRIFT_DURATION_MAX = 8

function randomBetween (min: number, max: number) {
  return min + Math.random() * (max - min)
}

function randomOffset (scale: number) {
  return new THREE.Vector3(
    (Math.random() - 0.5) * scale,
    (Math.random() - 0.5) * scale,
    (Math.random() - 0.5) * scale
  )
}

function randomDirection () {
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(THREE.MathUtils.lerp(-0.5, 1, Math.random()))
  return new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta)
  )
}

export default function StrandCluster () {
  return <div className={styles.container}>
    <Canvas dpr={1} camera={{ fov: 50, position: [0, 0, 10] }}>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 8, 18]} />

      <ambientLight intensity={0.5} />
      <pointLight position={[4, 5, 6]} intensity={30} color="#ffffff" />
      <pointLight position={[-5, -3, -4]} intensity={18} color="#cfd8ff" />

      <Cluster />
    </Canvas>
  </div>
}

interface Strand {
  basePoints: THREE.Vector3[]
  axis1: THREE.Vector3
  axis2: THREE.Vector3
  seed: number
  amplitude: number
  speed: number
}

interface Petal {
  particleIndex: number
  attachOffset: THREE.Vector3
  attached: boolean
  prevPos: THREE.Vector3
  rotX: number
  rotY: number
  rotZ: number
  angularVelocity: THREE.Vector3
  driftPos: THREE.Vector3
  driftVelocity: THREE.Vector3
  driftAge: number
  driftDuration: number
  size: number
  seed: number
}

interface Particle {
  strandIndex: number
  t: number
  travelSpeed: number
  jitter: THREE.Vector3
  baseSize: number
  seed: number
  detached: boolean
  driftPos: THREE.Vector3
  driftVelocity: THREE.Vector3
  driftAge: number
  driftDuration: number
  currentPos: THREE.Vector3
  color: THREE.Color
}

function Cluster () {
  const group = useRef<THREE.Group>(null)
  const mesh = useRef<THREE.InstancedMesh>(null)
  const petalMesh = useRef<THREE.InstancedMesh>(null)
  const lineGeometry = useRef<THREE.BufferGeometry>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const noise = useMemo(() => new SimplexNoise(), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const tmpBase = useMemo(() => new THREE.Vector3(), [])
  const gustTimer = useRef(randomBetween(GUST_INTERVAL_MIN, GUST_INTERVAL_MAX))
  const gustActive = useRef(0)

  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.quadraticCurveTo(0.45, 0.35, 0, 1)
    shape.quadraticCurveTo(-0.45, 0.35, 0, 0)
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: false })
    geometry.center()
    return geometry
  }, [])

  const { strands, particles, petals, linePositions } = useMemo(() => {
    const strandsData: Strand[] = []
    const allParticles: Particle[] = []
    const allPetals: Petal[] = []

    for (let s = 0; s < STRAND_COUNT; s++) {
      const dir = randomDirection()
      const length = 3.5 + Math.random() * 6
      const start = randomOffset(CORE_RADIUS)
      const end = dir.clone().multiplyScalar(length)
      const mid1 = end.clone().multiplyScalar(0.33).add(randomOffset(1.4))
      const mid2 = end.clone().multiplyScalar(0.7).add(randomOffset(2))

      const curve = new THREE.CatmullRomCurve3([start, mid1, mid2, end])
      const basePoints = curve.getPoints(CURVE_SAMPLES)

      const up = Math.abs(dir.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0)
      const axis1 = new THREE.Vector3().crossVectors(dir, up).normalize()
      const axis2 = new THREE.Vector3().crossVectors(dir, axis1).normalize()
      const seed = Math.random() * 100
      const amplitude = randomBetween(WAVE_AMPLITUDE_MIN, WAVE_AMPLITUDE_MAX)
      const speed = randomBetween(WAVE_SPEED_MIN, WAVE_SPEED_MAX)

      strandsData.push({ basePoints, axis1, axis2, seed, amplitude, speed })

      const particleCount = PARTICLES_MIN + Math.floor(Math.random() * (PARTICLES_MAX - PARTICLES_MIN))
      for (let p = 0; p < particleCount; p++) {
        // Staggered starting position so the cluster looks "alive" from
        // frame one, instead of every particle being born at the core
        // in unison. Later respawns always restart at t = 0.
        const t = Math.pow(Math.random(), 2.2)
        const jitter = randomOffset(0.12 + t * 0.35)
        allParticles.push({
          strandIndex: s,
          t,
          travelSpeed: randomBetween(TRAVEL_SPEED_MIN, TRAVEL_SPEED_MAX),
          jitter,
          baseSize: 0.4 + Math.random() * 0.6,
          seed: Math.random() * 100,
          detached: false,
          driftPos: new THREE.Vector3(),
          driftVelocity: new THREE.Vector3(),
          driftAge: 0,
          driftDuration: randomBetween(DRIFT_DURATION_MIN, DRIFT_DURATION_MAX),
          currentPos: new THREE.Vector3(),
          color: new THREE.Color(SPHERE_COLORS[Math.floor(Math.random() * SPHERE_COLORS.length)])
        })
      }
    }

    // Petals cling to a random sphere (mostly ones riding the outer half of
    // their strand, where the whip is strongest) until that sphere's speed
    // crosses a threshold — or it flies off the tip itself — then let go
    // and fall away like blossoms in the wind.
    const initPos = new THREE.Vector3()
    for (let p = 0; p < PETAL_COUNT; p++) {
      const particleIndex = Math.floor(Math.random() * allParticles.length)
      const particle = allParticles[particleIndex]
      sampleBasePoints(strandsData[particle.strandIndex], particle.t, initPos)
      allPetals.push({
        particleIndex,
        attachOffset: randomOffset(0.09),
        attached: true,
        prevPos: initPos.clone(),
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        angularVelocity: new THREE.Vector3(),
        driftPos: new THREE.Vector3(),
        driftVelocity: new THREE.Vector3(),
        driftAge: 0,
        driftDuration: randomBetween(PETAL_DRIFT_DURATION_MIN, PETAL_DRIFT_DURATION_MAX),
        size: randomBetween(PETAL_SIZE_MIN, PETAL_SIZE_MAX),
        seed: Math.random() * 100
      })
    }

    const totalLineVerts = STRAND_COUNT * CURVE_SAMPLES * 2
    return {
      strands: strandsData,
      particles: allParticles,
      petals: allPetals,
      linePositions: new Float32Array(totalLineVerts * 3)
    }
  }, [])

  useEffect(() => {
    if (!mesh.current) return
    particles.forEach((particle, i) => mesh.current?.setColorAt(i, particle.color))
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
  }, [particles])

  function sampleBasePoints (strand: Strand, t: number, out: THREE.Vector3) {
    const last = strand.basePoints.length - 1
    const scaled = THREE.MathUtils.clamp(t, 0, 1) * last
    const i0 = Math.min(last - 1, Math.floor(scaled))
    const i1 = i0 + 1
    const frac = scaled - i0
    return out.lerpVectors(strand.basePoints[i0], strand.basePoints[i1], frac)
  }

  function wavedPoint (strand: Strand, t: number, time: number, basePoint: THREE.Vector3, out: THREE.Vector3) {
    const amplitude = strand.amplitude * t
    const phase = time * strand.speed - t * WAVE_FREQUENCY + strand.seed
    out.copy(basePoint)
    out.addScaledVector(strand.axis1, Math.sin(phase) * amplitude)
    out.addScaledVector(strand.axis2, Math.cos(phase) * amplitude * 0.6)
    return out
  }

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    let vi = 0
    for (let s = 0; s < strands.length; s++) {
      const strand = strands[s]
      const pts = strand.basePoints
      const last = pts.length - 1
      for (let i = 0; i < last; i++) {
        wavedPoint(strand, i / last, time, pts[i], tmp)
        linePositions[vi++] = tmp.x
        linePositions[vi++] = tmp.y
        linePositions[vi++] = tmp.z
        wavedPoint(strand, (i + 1) / last, time, pts[i + 1], tmp)
        linePositions[vi++] = tmp.x
        linePositions[vi++] = tmp.y
        linePositions[vi++] = tmp.z
      }
    }
    if (lineGeometry.current) {
      lineGeometry.current.attributes.position.needsUpdate = true
    }

    particles.forEach((particle, i) => {
      const strand = strands[particle.strandIndex]
      const last = strand.basePoints.length - 1

      if (!particle.detached) {
        particle.t += particle.travelSpeed * delta

        if (particle.t >= 1) {
          // Slides off the tip: keep flying in the strand's local tangent
          // direction, now fully detached from the tentacle's own motion.
          const tip = strand.basePoints[last]
          const prevTip = strand.basePoints[last - 1]
          const tangent = tip.clone().sub(prevTip).normalize()
          wavedPoint(strand, 1, time, tip, tmp)

          particle.detached = true
          particle.driftAge = 0
          particle.driftPos.copy(tmp)
          particle.driftVelocity.copy(tangent)
            .multiplyScalar(randomBetween(DRIFT_SPEED_MIN, DRIFT_SPEED_MAX))
            .add(randomOffset(0.15))
        } else {
          sampleBasePoints(strand, particle.t, tmpBase)
          wavedPoint(strand, particle.t, time, tmpBase, tmp)
          const microWobble = noise.noise4d(tmpBase.x * 0.5, tmpBase.y * 0.5, tmpBase.z * 0.5, time * 0.3 + particle.seed) * 0.04
          dummy.position.set(
            tmp.x + particle.jitter.x + microWobble,
            tmp.y + particle.jitter.y + microWobble,
            tmp.z + particle.jitter.z + microWobble
          )
          particle.currentPos.copy(dummy.position)
          dummy.scale.setScalar(MAX_SIZE * particle.baseSize * THREE.MathUtils.lerp(1, 0.35, particle.t))
          dummy.updateMatrix()
          mesh.current?.setMatrixAt(i, dummy.matrix)
          return
        }
      }

      // Detached: drift freely and dissolve (shrink) until it respawns at the core.
      particle.driftAge += delta
      particle.driftPos.addScaledVector(particle.driftVelocity, delta)

      if (particle.driftAge >= particle.driftDuration) {
        particle.detached = false
        particle.t = 0
        particle.travelSpeed = randomBetween(TRAVEL_SPEED_MIN, TRAVEL_SPEED_MAX)
        particle.baseSize = 0.4 + Math.random() * 0.6
        particle.jitter = randomOffset(0.12)
        particle.driftDuration = randomBetween(DRIFT_DURATION_MIN, DRIFT_DURATION_MAX)
        dummy.scale.setScalar(0)
        dummy.position.copy(strand.basePoints[0])
        particle.currentPos.copy(dummy.position)
        dummy.updateMatrix()
        mesh.current?.setMatrixAt(i, dummy.matrix)
        return
      }

      const fadeT = particle.driftAge / particle.driftDuration
      const microWobble = noise.noise4d(particle.driftPos.x * 0.5, particle.driftPos.y * 0.5, particle.driftPos.z * 0.5, time * 0.3 + particle.seed) * 0.06
      dummy.position.set(
        particle.driftPos.x + microWobble,
        particle.driftPos.y + microWobble,
        particle.driftPos.z + microWobble
      )
      particle.currentPos.copy(dummy.position)
      dummy.scale.setScalar(MAX_SIZE * particle.baseSize * 0.35 * (1 - fadeT))
      dummy.updateMatrix()
      mesh.current?.setMatrixAt(i, dummy.matrix)
    })
    if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true

    // Every so often, a "gust" briefly makes petals far more sensitive to
    // motion, so a burst of them lets go at once instead of trickling off
    // one by one — the same dispersion that happens naturally on load.
    if (gustActive.current > 0) {
      gustActive.current -= delta
    } else {
      gustTimer.current -= delta
      if (gustTimer.current <= 0) {
        gustActive.current = PETAL_GUST_DURATION
        gustTimer.current = randomBetween(GUST_INTERVAL_MIN, GUST_INTERVAL_MAX)
      }
    }
    const petalDetachSpeed = gustActive.current > 0 ? PETAL_GUST_DETACH_SPEED : PETAL_DETACH_SPEED

    petals.forEach((petal, i) => {
      if (petal.attached) {
        const particle = particles[petal.particleIndex]

        if (particle.detached) {
          // The sphere it was riding on just flew off the tip (or is
          // already adrift) — let go now, using its last known position
          // instead of reading the particle's (possibly just-teleported)
          // current one.
          petal.attached = false
          petal.driftAge = 0
          petal.driftPos.copy(petal.prevPos)
          petal.driftVelocity.copy(particle.driftVelocity).multiplyScalar(0.5).add(randomOffset(0.1))
          petal.angularVelocity.set(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
          )
        } else {
          tmp.copy(particle.currentPos).add(petal.attachOffset)

          const vx = (tmp.x - petal.prevPos.x) / delta
          const vy = (tmp.y - petal.prevPos.y) / delta
          const vz = (tmp.z - petal.prevPos.z) / delta
          const speed = Math.sqrt(vx * vx + vy * vy + vz * vz)
          petal.prevPos.copy(tmp)

          if (speed > petalDetachSpeed) {
            petal.attached = false
            petal.driftAge = 0
            petal.driftPos.copy(tmp)
            petal.driftVelocity.set(vx, vy, vz).multiplyScalar(0.4).add(randomOffset(0.1))
            petal.angularVelocity.set(
              (Math.random() - 0.5) * 4,
              (Math.random() - 0.5) * 4,
              (Math.random() - 0.5) * 4
            )
          } else {
            dummy.position.copy(tmp)
            dummy.rotation.set(petal.rotX, petal.rotY, petal.rotZ)
            dummy.scale.setScalar(petal.size)
            dummy.updateMatrix()
            petalMesh.current?.setMatrixAt(i, dummy.matrix)
            return
          }
        }
      }

      // Detached: fall away with a fluttering side-to-side sway, tumbling
      // slowly, like a blossom carried off by the wind.
      petal.driftAge += delta
      const fadeT = petal.driftAge / petal.driftDuration

      if (fadeT >= 1) {
        petal.attached = true
        petal.particleIndex = Math.floor(Math.random() * particles.length)
        const newParticle = particles[petal.particleIndex]
        tmp.copy(newParticle.currentPos).add(petal.attachOffset)
        petal.prevPos.copy(tmp)
        petal.driftDuration = randomBetween(PETAL_DRIFT_DURATION_MIN, PETAL_DRIFT_DURATION_MAX)
        petal.size = randomBetween(PETAL_SIZE_MIN, PETAL_SIZE_MAX)
        dummy.scale.setScalar(0)
        dummy.position.copy(tmp)
        dummy.updateMatrix()
        petalMesh.current?.setMatrixAt(i, dummy.matrix)
        return
      }

      const swayPhase = time * PETAL_SWAY_FREQUENCY + petal.seed
      petal.driftPos.x += petal.driftVelocity.x * delta + Math.sin(swayPhase) * PETAL_SWAY_AMPLITUDE * delta
      petal.driftPos.y += petal.driftVelocity.y * delta - PETAL_FALL_SPEED * delta
      petal.driftPos.z += petal.driftVelocity.z * delta + Math.cos(swayPhase * 0.7) * PETAL_SWAY_AMPLITUDE * delta

      petal.rotX += petal.angularVelocity.x * delta
      petal.rotY += petal.angularVelocity.y * delta
      petal.rotZ += petal.angularVelocity.z * delta

      dummy.position.copy(petal.driftPos)
      dummy.rotation.set(petal.rotX, petal.rotY, petal.rotZ)
      dummy.scale.setScalar(petal.size * (1 - fadeT))
      dummy.updateMatrix()
      petalMesh.current?.setMatrixAt(i, dummy.matrix)
    })
    if (petalMesh.current) petalMesh.current.instanceMatrix.needsUpdate = true

    if (group.current) {
      group.current.rotation.y = time * 0.12
      group.current.rotation.x = Math.sin(time * 0.08) * 0.08
    }
  })

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry ref={lineGeometry}>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#e8ecf5" transparent opacity={0.35} />
      </lineSegments>

      <instancedMesh ref={mesh} args={[undefined, undefined, particles.length]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#ffffff" roughness={1} metalness={0} />
      </instancedMesh>

      <instancedMesh ref={petalMesh} args={[petalGeometry, undefined, petals.length]}>
        <meshStandardMaterial color="#ff00ff" roughness={0.9} metalness={0} side={THREE.DoubleSide} />
      </instancedMesh>
    </group>
  )
}
