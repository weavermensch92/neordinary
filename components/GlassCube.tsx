import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Constants for the GlassCube
const GLASS_THICKNESS = 1.2;
const GLASS_ROUGHNESS = 0.05; 
const GLASS_CHROMATIC_ABERRATION = 0.06;
const CUBE_SIZE = 3.5;
const CUBE_RADIUS = 0.25; // Restored to a normal rounded cube radius

export const GlassCube = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const tiltGroupRef = useRef<THREE.Group>(null);
  const floatGroupRef = useRef<THREE.Group>(null);
  
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();
  
  // Track continuous animation time
  const animTime = useRef(0);
  
  useFrame((state, delta) => {
    // 1. Time Management
    if (!hovered) {
         animTime.current += delta;
    }

    // 2. Manual Float Logic
    if (floatGroupRef.current) {
         floatGroupRef.current.position.y = Math.sin(animTime.current * 1.5) * 0.15;
    }

    // 3. Auto Spin Logic
    if (meshRef.current) {
         meshRef.current.rotation.x = Math.sin(animTime.current * 0.5) * 0.2;
         meshRef.current.rotation.y = animTime.current * 0.2; 
    }

    // 4. Mouse Follow (Tilt) Logic
    if (tiltGroupRef.current) {
      let targetRotationX = 0;
      let targetRotationY = 0;

      if (hovered && floatGroupRef.current) {
        // Calculate Tilt Target
        const center = new THREE.Vector3();
        floatGroupRef.current.getWorldPosition(center);
        center.project(camera); // Project to NDC [-1, 1]

        const mx = state.pointer.x;
        const my = state.pointer.y;

        const dx = mx - center.x;
        const dy = my - center.y;

        // Apply sensitivity
        targetRotationX = -dy * 2.5; 
        targetRotationY = dx * 2.5;
      }

      // Smoothly interpolate tilt group rotation
      tiltGroupRef.current.rotation.x = THREE.MathUtils.lerp(tiltGroupRef.current.rotation.x, targetRotationX, 0.1);
      tiltGroupRef.current.rotation.y = THREE.MathUtils.lerp(tiltGroupRef.current.rotation.y, targetRotationY, 0.1);
    }
  });

  return (
    <group ref={floatGroupRef}>
        <group ref={tiltGroupRef}>
            <RoundedBox
            ref={meshRef}
            args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} 
            radius={CUBE_RADIUS} 
            smoothness={4} 
            position={[0, 0, 0]} 
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
            onPointerOut={(e) => setHovered(false)}
            >
            <MeshTransmissionMaterial 
                backside={false}
                samples={16} 
                resolution={512} 
                thickness={GLASS_THICKNESS}
                roughness={GLASS_ROUGHNESS}
                anisotropy={1}
                chromaticAberration={GLASS_CHROMATIC_ABERRATION}
                color="#ffffff"
                background={new THREE.Color("black")}
            />
            </RoundedBox>
        </group>
    </group>
  );
};
