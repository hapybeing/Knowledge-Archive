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
      
      <div className="absolute top-0 left-0 z-30 w-full p-8 md:p-12 pointer-events-none flex justify-between items-start">
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

      {/* This is the fix. A dark gradient protects the text on the left, 
        and the text is locked into a tight column away from the center. 
      */}
      <div 
        className={`absolute top-0 left-0 h-full w-full md:w-1/2 bg-gradient-to-r from-space via-space/80 to-transparent z-20 pointer-events-none transition-opacity duration-1000 ${viewState === 'micro' ? 'opacity-100' : 'opacity-0'}`}
      />

      <div className={`absolute top-1/2 left-8 md:left-24 -translate-y-1/2 z-30 w-full max-w-sm pointer-events-none transition-all duration-1000 delay-300 ${viewState === 'micro' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
        <div className="flex flex-col gap-6">
          <p className="font-mono text-neonCyan text-[10px] tracking-[0.4em] uppercase">
            {activeData?.category} Discipline
          </p>
          <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-white uppercase leading-none">
            {activeData?.title}
          </h2>
          <div className="h-[1px] w-8 bg-white/30 my-2" />
          <p className="text-white/50 font-sans text-xs md:text-sm leading-relaxed max-w-xs">
            Accessing structural data. The environment simulation relies strictly on procedural mathematics, discarding traditional geometry for volatile, shader-driven energy cores.
          </p>
        </div>
      </div>

      <div className={`absolute bottom-8 md:bottom-12 left-8 md:left-24 z-30 transition-all duration-1000 delay-500 ${viewState === 'micro' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        <button 
          onClick={() => setActiveNode(null)}
          className="group relative px-6 py-3 font-mono text-[10px] tracking-[0.3em] text-white overflow-hidden border border-white/20 hover:border-neonCyan hover:text-neonCyan transition-colors duration-500"
        >
          <span className="relative z-10">INITIATE RETURN</span>
        </button>
      </div>

      <div className="fixed top-0 left-0 w-full h-full z-0">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center text-white font-mono text-xs tracking-widest">
            CALIBRATING UNIVERSE...
          </div>
        }>
          <Scene />
        </Suspense>
      </div>

      <div className="w-full h-[500vh] pointer-events-none" />
    </main>
  );
}
