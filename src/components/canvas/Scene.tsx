"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import InstancedStarfield from "./environment/InstancedStarfield";

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 45, near: 0.1, far: 1000 }}
      dpr={[1, 2]} // Cap pixel ratio for performance
      gl={{ antialias: false, powerPreference: "high-performance" }} // Optimized rendering
    >
      <color attach="background" args={["#030305"]} />
      
      {/* Ambient environment lighting */}
      <ambientLight intensity={0.2} />
      
      {/* The background stars */}
      <InstancedStarfield count={15000} />

      {/* Preloads all assets to prevent stuttering later */}
      <Preload all />
    </Canvas>
  );
}
