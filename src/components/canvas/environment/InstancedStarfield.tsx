"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StarfieldProps {
  count?: number;
}

export default function InstancedStarfield({ count = 10000 }: StarfieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Generate random positions for the stars in a massive sphere
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const r = 40 + Math.random() * 100; // Radius distance
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      temp.push({ x, y, z });
    }
    return temp;
  }, [count]);

  // Apply positions to the instanced mesh once on mount
  useMemo(() => {
    if (!meshRef.current) return;
    particles.forEach((particle, i) => {
      dummy.position.set(particle.x, particle.y, particle.z);
      
      // Randomize star size slightly
      const scale = 0.5 + Math.random() * 1.5;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [particles, dummy]);

  // Slowly rotate the entire starfield for a subtle cinematic effect
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.02;
      meshRef.current.rotation.z -= delta * 0.01;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* Icosahedron provides a nice low-poly circular shape without too many vertices */}
      <icosahedronGeometry args={[0.05, 0]} />
      <meshBasicMaterial 
        color="#ffffff" 
        transparent 
        opacity={0.8}
        depthWrite={false} 
      />
    </instancedMesh>
  );
}
