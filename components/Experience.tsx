// @ts-nocheck
import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { GlassCube } from './GlassCube';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      ambientLight: any;
      spotLight: any;
      pointLight: any;
      color: any;
      [elemName: string]: any;
    }
  }
}

interface ExperienceProps {
  scrollOffset: React.MutableRefObject<number>;
  paused?: boolean;
}

// Parallax Group Component
const ParallaxGroup = ({ children, speed = 1, zPosition = 0, scrollOffset }: { children?: React.ReactNode, speed?: number, zPosition?: number, scrollOffset: React.MutableRefObject<number> }) => {
  const group = useRef<THREE.Group>(null);
  const { width } = useThree((state) => state.viewport);
  const totalPages = 6;

  useFrame(() => {
    if (group.current) {
      const offset = scrollOffset.current;
      group.current.position.x = -offset * width * (totalPages - 1) * speed;
    }
  });

  return (
    <group ref={group} position={[0, 0, zPosition]}>
      {children}
    </group>
  );
};

// 3D Text Component
const Hero3DText = () => {
  const { viewport } = useThree();
  const responsiveScale = Math.min(viewport.width / 15, 0.7);

  const fontSize = 1.8 * responsiveScale;
  const lineHeight = 0.85;

  const fontUrl = "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.17/files/inter-latin-900-normal.woff";

  return (
    <group position={[0, 0, 0]}>
      <Text
        position={[0, fontSize * lineHeight * 1.5, 0]}
        fontSize={fontSize}
        font={fontUrl}
        color="white"
        anchorX="center"
        anchorY="middle"
        letterSpacing={-0.05}
      >
        GRIDGE
      </Text>
      <Text
        position={[0, fontSize * lineHeight * 0.5, 0]}
        fontSize={fontSize}
        font={fontUrl}
        color="white"
        anchorX="center"
        anchorY="middle"
        letterSpacing={-0.05}
      >
        NE(O)RDINARY
      </Text>
      <Text
        position={[0, fontSize * lineHeight * -0.5, 0]}
        fontSize={fontSize}
        font={fontUrl}
        color="white"
        anchorX="center"
        anchorY="middle"
        letterSpacing={-0.05}
      >
        NEWWAVE
      </Text>
      <Text
        position={[0, fontSize * lineHeight * -1.5, 0]}
        fontSize={fontSize}
        font={fontUrl}
        color="white"
        anchorX="center"
        anchorY="middle"
        letterSpacing={-0.05}
      >
        for AI MAKERS
      </Text>
    </group>
  );
};

const SceneContent = ({ scrollOffset }: { scrollOffset: React.MutableRefObject<number> }) => {
  return (
    <>
      <ParallaxGroup speed={1} zPosition={-2} scrollOffset={scrollOffset}>
        <Hero3DText />
      </ParallaxGroup>

      <ParallaxGroup speed={0.6} zPosition={0} scrollOffset={scrollOffset}>
        <GlassCube />
      </ParallaxGroup>
    </>
  );
};

export const Experience: React.FC<ExperienceProps> = ({ scrollOffset, paused = false }) => {
  return (
    <>
      {paused && <div className="absolute inset-0 bg-[#050505] z-10" />}
      <div className="absolute inset-0" style={{ visibility: paused ? 'hidden' : 'visible' }}>
        <Canvas
          // @ts-ignore
          eventSource={document.getElementById('root')}
          className="pointer-events-none"
          camera={{ position: [0, 0, 10], fov: 35 }}
          gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}
        >
          <color attach="background" args={['#050505']} />

          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={1} />

          <Suspense fallback={null}>
            <Environment preset="city" />
            <SceneContent scrollOffset={scrollOffset} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
};
