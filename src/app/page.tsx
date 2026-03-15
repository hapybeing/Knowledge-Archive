"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import the Scene to avoid SSR issues with Three.js
const Scene = dynamic(() => import("../components/canvas/Scene"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative w-screen h-screen">
      {/* DOM Overlay Layer (HUD) */}
      <div className="absolute top-0 left-0 z-10 w-full p-8 pointer-events-none flex justify-between items-start">
        <h1 className="text-sm tracking-[0.2em] font-mono text-white/70 uppercase">
          The Archive
        </h1>
        <div className="text-xs tracking-widest font-mono text-neonCyan">
          SYS.ONLINE
        </div>
      </div>

      {/* WebGL Canvas Layer */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white font-mono text-xs">CALIBRATING UNIVERSE...</div>}>
          <Scene />
        </Suspense>
      </div>
    </main>
  );
}
