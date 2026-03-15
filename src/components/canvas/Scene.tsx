"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import InstancedStarfield from "./environment/InstancedStarfield";
import DataNexus from "./environment/DataNexus";
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
      <color attach="background" args={["#010103"]} />
      
      {/* Exponential fog gives depth to the 3D space, masking objects far away */}
      <fogExp2 attach="fog" color="#010103" density={0.015} />
      
      <ambientLight intensity={0.1} />
      
      <CameraRig />
      
      {/* The Macro Environment */}
      <DataNexus />
      <InstancedStarfield count={8000} />
      
      {/* The Interactive Elements */}
      <ConstellationGraph />
      <ActiveWorldContainer />
      
      <Effects />
      <Preload all />
    </Canvas>
  );
}
