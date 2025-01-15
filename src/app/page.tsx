// 'use client'

// import { Canvas } from '@react-three/fiber'
// import { OrbitControls } from '@react-three/drei'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      {/* <Canvas>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshPhongMaterial />
        </mesh>
        <OrbitControls />
      </Canvas> */}
      <div className={styles.container}>
        This is the personal website and portfolio of Gianluca Macaluso.
        <br /><br />
        I&apos;m a UI/UX designer and Frontend web developer from Bologna (IT) 
        with more than 15 of experience in designing, planning and coding great user interfaces.
        <br /><br />  
        This website is currently under redesign and update.<br />
        If you need to get in touch with me, just drop a line here: 
        &nbsp;<a href="mailto:maccaluso@gmail.com" target="blank">maccaluso@gmail.com</a>
      </div>
    </div>
  );
}