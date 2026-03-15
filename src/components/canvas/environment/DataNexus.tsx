"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DataNexus() {
  const pointsRef = useRef<THREE.Points>(null);

  // 50,000 background particles creating a volumetric nebula
  const count = 50000;
  
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    const colorCore = new THREE.Color("#00f3ff");
    const colorEdge = new THREE.Color("#110033");

    for (let i = 0; i < count; i++) {
      // Create a massive twisting galaxy shape
      const radius = Math.random() * 60;
      const spinAngle = radius * 0.05;
      const branchAngle = ((i % 3) * Math.PI * 2) / 3;
      
      const x = Math.cos(spinAngle + branchAngle) * radius + (Math.random() - 0.5) * 10;
      const z = Math.sin(spinAngle + branchAngle) * radius + (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 20 * (1 - radius/60); // Taper at edges

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z - 20; // Push deep into the background

      // Mix colors based on distance from center
      const mixedColor = colorCore.clone().lerp(colorEdge, radius / 60);
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.z = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        vertexColors 
        transparent 
        opacity={0.4} 
        sizeAttenuation 
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
