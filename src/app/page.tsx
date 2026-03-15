"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useStore } from "@/store/useStore";

const Scene = dynamic(() => import("../components/canvas/Scene"), {
  ssr: false,
});

export default function Home() {
  const activeNode = useStore((state) => state.activeNode);
  const setActiveNode = useStore((state) => state.setActiveNode);
  const viewState = useStore((state) => state.viewState);

  return (
    <main className="relative w-screen h-screen bg-space overflow-hidden">
      <div className="absolute top-0 left-0 z-10 w-full p-8 pointer-events-none flex justify-between items-start">
        <h1 className="text-sm tracking-[0.2em] font-mono text-white/70 uppercase">
          The Archive
        </h1>
        <div className="text-xs tracking-widest font-mono text-neonCyan flex flex-col items-end gap-2">
          <span>SYS.ONLINE</span>
          {activeNode && (
            <span className="text-white/50">
              LOC: {activeNode.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-1000 ${viewState === 'micro' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button 
          onClick={() => setActiveNode(null)}
          className="group relative px-6 py-3 font-mono text-xs tracking-widest text-white overflow-hidden border border-white/20 hover:border-neonCyan transition-colors duration-500"
        >
          <div className="absolute inset-0 bg-neonCyan/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          <span className="relative z-10">INITIATE RETURN</span>
        </button>
      </div>

      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center text-white font-mono text-xs tracking-widest">
            CALIBRATING UNIVERSE...
          </div>
        }>
          <Scene />
        </Suspense>
      </div>
    </main>
  );
}
