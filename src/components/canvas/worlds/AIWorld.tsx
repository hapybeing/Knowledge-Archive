"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function AIWorld() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const gridSize = 10;
  const spacing = 1.5;
  const count = gridSize * gridSize * gridSize;

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const baseColor = new THREE.Color("#110033");
    for(let i = 0; i < count; i++) {
      baseColor.toArray(arr, i * 3);
    }
    return arr;
  }, [count]);

  useMemo(() => {
    if (!meshRef.current) return;
    let i = 0;
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          dummy.position.set(
            (x - gridSize / 2) * spacing,
            (y - gridSize / 2) * spacing,
            (z - gridSize / 2) * spacing
          );
          dummy.updateMatrix();
          meshRef.current.setMatrixAt(i, dummy.matrix);
          i++;
        }
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, gridSize, spacing]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
    meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.5;

    const time = state.clock.elapsedTime;
    const highlightColor = new THREE.Color("#b026ff");
    const baseColor = new THREE.Color("#110033");

    for (let i = 0; i < count; i++) {
      const isFiring = Math.sin(i * 0.1 + time * 5.0) > 0.95;
      meshRef.current.setColorAt(i, isFiring ? highlightColor : baseColor);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}
