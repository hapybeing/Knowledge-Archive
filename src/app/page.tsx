"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";
import { useStore } from "@/store/useStore";
import ScrollManager from "@/components/dom/ScrollManager";
import universeData from "@/data/universe.json";

const Scene = dynamic(() => import("../components/canvas/Scene"), {
  ssr: false,
});

export default function Home() {
  const activeNode = useStore((state) => state.activeNode);
  const setActiveNode = useStore((state) => state.setActiveNode);
  const viewState = useStore((state) => state.viewState);

  const activeData = useMemo(() => {
    return universeData.find((n) => n.id === activeNode) || null;
  }, [activeNode]);

  return (
    <main className="relative w-screen h-screen bg-space overflow-hidden">
      <ScrollManager />
      
      {/* Top Navigation HUD */}
      <div className="absolute top-0 left-0 z-20 w-full p-8 pointer-events-none flex justify-between items-start">
        <h1 className="text-sm tracking-[0.2em] font-mono text-white/70 uppercase">
          The Archive
        </h1>
        <div className="text-xs tracking-widest font-mono text-neonCyan flex flex-col items-end gap-2">
          <span>SYS.ONLINE</span>
          <span className={`text-white/50 transition-opacity duration-500 ${activeNode ? 'opacity-100' : 'opacity-0'}`}>
            LOC: {activeData?.coordinates.join(", ")}
          </span>
        </div>
      </div>

      {/* Inner World Data Overlay */}
      <div className={`absolute top-1/2 left-1/4 -translate-y-1/2 z-10 w-full max-w-lg pointer-events-none transition-all duration-1000 delay-500 ${viewState === 'micro' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
        <div className="flex flex-col gap-4">
          <p className="font-mono text-neonCyan text-xs tracking-[0.3em] uppercase">
            {activeData?.category} Discipline
          </p>
          <h2 className="text-5xl font-light tracking-tight text-white uppercase">
            {activeData?.title}
          </h2>
          <div className="h-[1px] w-12 bg-white/30 my-2" />
          <p className="text-white/60 font-sans text-sm leading-relaxed max-w-sm">
            Accessing structural data... the simulation environments are rendering purely through generative mathematical functions. 
          </p>
        </div>
      </div>

      {/* Return Control */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 transition-all duration-1000 delay-500 ${viewState === 'micro' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <button 
          onClick={() => setActiveNode(null)}
          className="group relative px-6 py-3 font-mono text-xs tracking-widest text-white overflow-hidden border border-white/20 hover:border-neonCyan transition-colors duration-500"
        >
          <div className="absolute inset-0 bg-neonCyan/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          <span className="relative z-10">INITIATE RETURN</span>
        </button>
      </div>

      {/* The 3D Engine */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center text-white font-mono text-xs tracking-widest">
            CALIBRATING UNIVERSE...
          </div>
        }>
          <Scene />
        </Suspense>
      </div>

      {/* Scroll Trigger Height */}
      <div className="w-full h-[500vh] pointer-events-none" />
    </main>
  );
}
