'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <Canvas>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshPhongMaterial />
        </mesh>
        <OrbitControls />
      </Canvas>
    </div>
  );
}