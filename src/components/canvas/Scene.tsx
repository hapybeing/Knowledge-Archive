"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import InstancedStarfield from "./environment/InstancedStarfield";
import ConstellationGraph from "./nodes/ConstellationGraph";
import ActiveWorldContainer from "./worlds/ActiveWorldContainer";
import CameraRig from "./camera/CameraRig";
import Effects from "./postprocessing/Effects";

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 45, near: 0.1, far: 1000 }}
      dpr={[1, 2]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#030305"]} />
      <ambientLight intensity={0.2} />
      
      <CameraRig />
      
      <InstancedStarfield count={15000} />
      <ConstellationGraph />
      <ActiveWorldContainer />
      
      {/* The Cinematic Lens */}
      <Effects />

      <Preload all />
    </Canvas>
  );
}
