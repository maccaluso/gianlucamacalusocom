'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import styles from './visualization.module.css'

export default function Visualization () {
  return <div className={styles.visualizationContainer}>
    <Canvas>
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhongMaterial />
      </mesh>
      <OrbitControls />
    </Canvas>
  </div>
}