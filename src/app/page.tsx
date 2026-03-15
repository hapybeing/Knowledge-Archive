"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useStore } from "@/store/useStore";
import ScrollManager from "@/components/dom/ScrollManager";
import SplitText from "@/components/dom/ui/SplitText";
import FounderModal from "@/components/dom/ui/FounderModal";
import InnerWorldScroll from "@/components/dom/worlds/InnerWorldScroll";
import { motion, AnimatePresence } from "framer-motion";

const Scene = dynamic(() => import("../components/canvas/Scene"), { ssr: false });

export default function Home() {
  const viewState = useStore((state) => state.viewState);
  const setContactOpen = useStore((state) => state.setContactOpen);

  return (
    <main className="relative w-screen bg-[#010103] selection:bg-neonCyan selection:text-space">
      <ScrollManager />
      <FounderModal />
      
      {/* Global Header */}
      <header className="fixed top-0 left-0 z-50 w-full p-8 md:p-12 flex justify-between items-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-[10px] md:text-xs tracking-[0.4em] font-mono text-white/70 uppercase mix-blend-difference"
        >
          The Archive <span className="text-neonCyan ml-1">v2.0</span>
        </motion.div>

        <motion.button
          onClick={() => setContactOpen(true)}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="pointer-events-auto px-6 py-2 border border-white/20 rounded-none text-[10px] font-mono tracking-widest text-white hover:border-neonCyan hover:text-neonCyan transition-all duration-300 mix-blend-difference backdrop-blur-sm"
        >
          [ COMMS ]
        </motion.button>
      </header>

      {/* Welcome Sequence (Macro View Only) */}
      <AnimatePresence>
        {viewState === 'macro' && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-screen flex flex-col justify-center items-center z-20 pointer-events-none px-8 text-center"
          >
            <SplitText 
              text="Welcome to the sum of human understanding."
              className="text-4xl md:text-6xl font-light tracking-tighter text-white max-w-4xl"
              highlightWords={["sum", "understanding"]}
              delay={0.1}
            />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-12 text-[10px] font-mono tracking-[0.4em] text-white/40 animate-pulse"
            >
              SCROLL TO INITIATE DESCENT ↓
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Inner World Overlay */}
      <AnimatePresence>
        {viewState === 'micro' && <InnerWorldScroll />}
      </AnimatePresence>

      {/* The 3D Engine */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>

      {/* Main Scroll Track */}
      <div className="w-full h-[5000vh] pointer-events-none relative z-10" />
    </main>
  );
}
