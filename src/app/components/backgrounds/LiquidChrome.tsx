'use client'

import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { SimplexNoise } from 'three-stdlib'

import styles from './liquidChrome.module.css'

// Prototype background inspired by Can Buyukberber's liquid-metal /
// organic-morphing renders: a single reflective blob, slowly warping
// via simplex noise, lit by a few strong colored point lights instead
// of an environment map.
export default function LiquidChrome () {
  return <div className={styles.container}>
    <Canvas dpr={1} camera={{ fov: 45, position: [0, 0, 6] }}>
      <color attach="background" args={['#000000']} />

      <ambientLight intensity={0.15} />
      <pointLight position={[5, 4, 5]} intensity={60} color="#ffffff" />
      <pointLight position={[-6, -3, -4]} intensity={35} color="#3a5bff" />
      <pointLight position={[0, 5, -6]} intensity={30} color="#ff3a6a" />

      <MetallicBlob />
    </Canvas>
  </div>
}

function MetallicBlob () {
  const mesh = useRef<THREE.Mesh>(null)
  const noise = useMemo(() => new SimplexNoise(), [])

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.6, 64), [])
  const basePositions = useMemo(
    () => Float32Array.from(geometry.attributes.position.array),
    [geometry]
  )

  useFrame((state) => {
    const time = state.clock.elapsedTime * 0.25
    const position = geometry.attributes.position

    for (let i = 0; i < position.count; i++) {
      const ix = i * 3
      const x = basePositions[ix]
      const y = basePositions[ix + 1]
      const z = basePositions[ix + 2]
      const n = noise.noise4d(x * 0.6, y * 0.6, z * 0.6, time)
      const displacement = 1 + n * 0.35
      position.setXYZ(i, x * displacement, y * displacement, z * displacement)
    }

    position.needsUpdate = true
    geometry.computeVertexNormals()

    if (mesh.current) {
      mesh.current.rotation.y = time * 0.6
      mesh.current.rotation.x = Math.sin(time * 0.3) * 0.3
    }
  })

  return (
    <mesh ref={mesh} geometry={geometry}>
      <meshStandardMaterial color="#e8e8e8" metalness={1} roughness={0.15} />
    </mesh>
  )
}
