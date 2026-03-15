"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useStore } from "@/store/useStore";
import ScrollManager from "@/components/dom/ScrollManager";
import SplitText from "@/components/dom/ui/SplitText";
import { motion } from "framer-motion";

const Scene = dynamic(() => import("../components/canvas/Scene"), { ssr: false });

export default function Home() {
  const activeNode = useStore((state) => state.activeNode);
  const viewState = useStore((state) => state.viewState);

  return (
    <main className="relative w-screen bg-[#010103] selection:bg-neonCyan selection:text-space">
      <ScrollManager />
      
      {/* Global Header */}
      <header className="fixed top-0 left-0 z-50 w-full p-8 md:p-12 flex justify-between items-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-xs tracking-[0.4em] font-mono text-white/70 uppercase"
        >
          The Archive
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="pointer-events-auto px-6 py-2 border border-white/20 rounded-full text-xs font-mono tracking-widest text-white hover:bg-white hover:text-black transition-all duration-300"
        >
          CONTACT
        </motion.button>
      </header>

      {/* Welcome Sequence (Only visible at top of scroll) */}
      <div className="absolute top-0 left-0 w-full h-screen flex flex-col justify-center items-center z-20 pointer-events-none px-8 text-center">
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
          className="mt-12 text-xs font-mono tracking-[0.3em] text-white/50"
        >
          SCROLL TO INITIATE DESCENT
        </motion.div>
      </div>

      {/* The 3D Engine - Fixed in Background */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>

      {/* Massive Scroll Area to drive the 3D Camera */}
      <div className="w-full h-[5000vh] pointer-events-none relative z-10" />
    </main>
  );
}
