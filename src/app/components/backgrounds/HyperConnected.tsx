'use client'

import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { SimplexNoise } from 'three-stdlib'

import styles from './hyperConnected.module.css'

// Prototype background inspired by Can Buyukberber's "Hyperconnected" series:
// a cloud of drifting nodes, dynamically linked by lines when close enough,
// suggesting an organic, ever-reconfiguring network.
const NODE_COUNT = 220
const CONNECT_DISTANCE = 1.8
const FIELD_RADIUS = 6
const MAX_LINES = NODE_COUNT * 12

export default function HyperConnected () {
  return <div className={styles.container}>
    <Canvas dpr={1} camera={{ fov: 55, position: [0, 0, 9] }}>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.6} />
      <NetworkField />
    </Canvas>
  </div>
}

function NetworkField () {
  const group = useRef<THREE.Group>(null)
  const points = useRef<THREE.Points>(null)
  const lines = useRef<THREE.LineSegments>(null)
  const noise = useMemo(() => new SimplexNoise(), [])

  const nodes = useMemo(() => {
    const temp = []
    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = FIELD_RADIUS * Math.cbrt(Math.random())
      temp.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        seed: Math.random() * 100
      })
    }
    return temp
  }, [])

  const positions = useMemo(() => new Float32Array(NODE_COUNT * 3), [])
  const linePositions = useMemo(() => new Float32Array(MAX_LINES * 6), [])

  useFrame((state) => {
    const time = state.clock.elapsedTime * 0.08

    for (let i = 0; i < NODE_COUNT; i++) {
      const n = nodes[i]
      const dx = noise.noise4d(n.x * 0.15, n.y * 0.15, n.z * 0.15, time + n.seed) * 0.6
      const dy = noise.noise4d(n.y * 0.15, n.z * 0.15, n.x * 0.15, time + n.seed) * 0.6
      const dz = noise.noise4d(n.z * 0.15, n.x * 0.15, n.y * 0.15, time + n.seed) * 0.6
      positions[i * 3] = n.x + dx
      positions[i * 3 + 1] = n.y + dy
      positions[i * 3 + 2] = n.z + dz
    }

    if (points.current) {
      points.current.geometry.attributes.position.needsUpdate = true
    }

    let lineIndex = 0
    for (let i = 0; i < NODE_COUNT && lineIndex < MAX_LINES; i++) {
      const ix = i * 3
      for (let j = i + 1; j < NODE_COUNT && lineIndex < MAX_LINES; j++) {
        const jx = j * 3
        const dx = positions[ix] - positions[jx]
        const dy = positions[ix + 1] - positions[jx + 1]
        const dz = positions[ix + 2] - positions[jx + 2]
        const distSq = dx * dx + dy * dy + dz * dz
        if (distSq < CONNECT_DISTANCE * CONNECT_DISTANCE) {
          const li = lineIndex * 6
          linePositions[li] = positions[ix]
          linePositions[li + 1] = positions[ix + 1]
          linePositions[li + 2] = positions[ix + 2]
          linePositions[li + 3] = positions[jx]
          linePositions[li + 4] = positions[jx + 1]
          linePositions[li + 5] = positions[jx + 2]
          lineIndex++
        }
      }
    }

    if (lines.current) {
      lines.current.geometry.setDrawRange(0, lineIndex * 2)
      lines.current.geometry.attributes.position.needsUpdate = true
    }

    if (group.current) {
      group.current.rotation.y = time * 0.6
      group.current.rotation.x = Math.sin(time * 0.3) * 0.15
    }
  })

  return (
    <group ref={group}>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#8fe3ff" size={0.06} sizeAttenuation transparent opacity={0.9} />
      </points>

      <lineSegments ref={lines}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#4fa8ff" transparent opacity={0.25} />
      </lineSegments>
    </group>
  )
}
