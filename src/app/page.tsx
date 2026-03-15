"use client";

import dynamic from "next/dynamic";
import { Suspense, useMemo } from "react";
import { useStore } from "@/store/useStore";
import ScrollManager from "@/components/dom/ScrollManager";
import universeData from "@/data/universe.json";
import { motion, AnimatePresence } from "framer-motion";

const Scene = dynamic(() => import("../components/canvas/Scene"), { ssr: false });

export default function Home() {
  const activeNode = useStore((state) => state.activeNode);
  const setActiveNode = useStore((state) => state.setActiveNode);
  const viewState = useStore((state) => state.viewState);

  const activeData = useMemo(() => {
    return universeData.find((n) => n.id === activeNode) || null;
  }, [activeNode]);

  return (
    <main className="relative w-screen h-screen bg-[#010103] overflow-hidden selection:bg-neonCyan selection:text-space">
      <ScrollManager />
      
      {/* Top Navigation - Always Visible */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 z-30 w-full p-8 md:p-12 pointer-events-none flex justify-between items-start"
      >
        <h1 className="text-[10px] tracking-[0.4em] font-mono text-white/50 uppercase">
          The Archive <span className="text-neonCyan ml-2">v2.0</span>
        </h1>
        <div className="text-[10px] tracking-widest font-mono flex flex-col items-end gap-2">
          <span className="text-neonCyan animate-pulse">SYS.ONLINE</span>
          <AnimatePresence>
            {activeNode && (
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="text-white/40"
              >
                LOC: {activeData?.coordinates.join(", ")}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Cinematic Vignette protecting the text */}
      <div 
        className={`absolute top-0 left-0 h-full w-full md:w-[60%] bg-gradient-to-r from-[#010103] via-[#010103]/80 to-transparent z-20 pointer-events-none transition-opacity duration-1000 ${viewState === 'micro' ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Dynamic Data Overlay */}
      <div className="absolute top-1/2 left-8 md:left-24 -translate-y-1/2 z-30 w-full max-w-xl pointer-events-none">
        <AnimatePresence mode="wait">
          {viewState === 'micro' && activeData && (
            <motion.div 
              key={activeData.id}
              className="flex flex-col gap-6"
            >
              {/* Staggered text reveals */}
              <div className="overflow-hidden">
                <motion.p 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
                  className="font-mono text-neonCyan text-[10px] tracking-[0.5em] uppercase"
                >
                  {activeData.category} DISCIPLINE //
                </motion.p>
              </div>

              <div className="overflow-hidden pb-4">
                <motion.h2 
                  initial={{ y: "100%", rotate: 2 }}
                  animate={{ y: 0, rotate: 0 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  className="text-5xl md:text-7xl font-light tracking-tighter uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40"
                >
                  {activeData.title}
                </motion.h2>
              </div>

              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="h-[1px] w-12 bg-neonCyan origin-left" 
              />
              
              <div className="overflow-hidden">
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-white/60 font-sans text-sm md:text-base leading-relaxed max-w-md"
                >
                  Accessing core structural data. The environment simulation relies strictly on procedural mathematics, discarding traditional geometry for volatile, real-time energy cores.
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animated Return Button */}
      <div className={`absolute bottom-8 md:bottom-16 left-8 md:left-24 z-30 transition-all duration-1000 delay-700 ${viewState === 'micro' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        <button 
          onClick={() => setActiveNode(null)}
          className="group relative px-8 py-4 overflow-hidden border border-white/10 hover:border-neonCyan transition-colors duration-500 bg-black/50 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neonCyan/20 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out" />
          <span className="relative z-10 font-mono text-[10px] tracking-[0.4em] text-white group-hover:text-neonCyan transition-colors duration-300">
            [ INITIATE RETURN ]
          </span>
        </button>
      </div>

      <div className="fixed top-0 left-0 w-full h-full z-0">
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>

      <div className="w-full h-[500vh] pointer-events-none" />
    </main>
  );
}
