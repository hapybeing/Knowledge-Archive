"use client";

import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import SplitText from "../ui/SplitText";
import universeData from "@/data/universe.json";

export default function InnerWorldScroll() {
  const activeNode = useStore((state) => state.activeNode);
  const setActiveNode = useStore((state) => state.setActiveNode);
  
  const data = universeData.find((n) => n.id === activeNode);

  if (!data) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="absolute top-0 left-0 w-full h-full overflow-y-auto overflow-x-hidden z-30 scroll-smooth"
      style={{ scrollbarWidth: 'none' }} // Hides native scrollbar for premium feel
    >
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-screen flex flex-col justify-center px-8 md:px-24">
        <div className="max-w-3xl">
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="font-mono text-neonCyan text-[10px] tracking-[0.5em] uppercase mb-6"
          >
            {data.category} DISCIPLINE //
          </motion.p>
          <SplitText 
            text={data.title}
            className="text-5xl md:text-8xl font-light tracking-tighter uppercase leading-none text-white mb-8"
            delay={0.2}
          />
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="h-[1px] w-24 bg-gradient-to-r from-neonCyan to-transparent origin-left mb-8" 
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="text-white/50 font-sans text-sm md:text-base max-w-lg leading-relaxed"
          >
            Accessing structural data. The environment simulation relies strictly on procedural mathematics, discarding traditional geometry for volatile, real-time energy cores.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-12 left-8 md:left-24 font-mono text-[10px] tracking-[0.3em] text-white/30 animate-pulse"
        >
          SCROLL TO DECRYPT LORE ↓
        </motion.div>
      </section>

      {/* 2. TOPOLOGICAL MAP SECTION */}
      <section className="relative w-full min-h-screen py-24 px-8 md:px-24 flex flex-col justify-center border-t border-white/10 bg-[#010103]/60 backdrop-blur-md">
        <motion.h3 
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: true }}
          className="font-mono text-xs tracking-[0.4em] text-neonCyan uppercase mb-12"
        >
          [ TOPOLOGICAL MAP ]
        </motion.h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item, i) => (
            <motion.div 
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors duration-500 group"
            >
              <div className="w-8 h-8 border border-neonCyan/30 mb-6 group-hover:rotate-45 transition-transform duration-700" />
              <h4 className="text-white text-xl tracking-tight mb-4">SECTOR {item}.0</h4>
              <p className="text-white/40 text-xs font-mono leading-relaxed">
                Encrypted dataset pertaining to the foundational principles of this node. Awaiting authorization to expand.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. TIMELINE & DEEP LORE */}
      <section className="relative w-full min-h-screen py-32 px-8 md:px-24 bg-[#010103]/80 backdrop-blur-lg border-t border-white/10">
        <div className="max-w-4xl mx-auto flex gap-12">
          {/* Vertical Timeline Line */}
          <div className="w-[1px] bg-gradient-to-b from-neonCyan via-white/20 to-transparent hidden md:block" />
          
          <div className="flex flex-col gap-32 pb-32">
            <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 20 }} viewport={{ once: true }}>
              <h3 className="font-mono text-xs tracking-[0.4em] text-neonCyan uppercase mb-6">ORIGIN EPOCH</h3>
              <p className="text-2xl md:text-4xl font-light text-white leading-snug tracking-tight">
                Before the interface, there was only raw data. The <span className="text-neonCyan">architects</span> coded the first laws of this sector, binding chaos into structure.
              </p>
            </motion.div>

            <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 20 }} viewport={{ once: true }}>
              <h3 className="font-mono text-xs tracking-[0.4em] text-neonCyan uppercase mb-6">THE EXPANSION</h3>
              <p className="text-xl md:text-3xl font-light text-white/70 leading-snug tracking-tight">
                As processing power scaled, so did the complexity of the discipline. We mapped the unknown, creating pathways where there was once only static.
              </p>
            </motion.div>
          </div>
        </div>

        {/* EXIT BUTTON */}
        <div className="w-full flex justify-center pb-32">
          <button 
            onClick={() => setActiveNode(null)}
            className="group relative px-12 py-6 overflow-hidden border border-white/20 hover:border-neonCyan transition-colors duration-700 bg-black"
          >
            <div className="absolute inset-0 bg-neonCyan/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 font-mono text-xs tracking-[0.4em] text-white group-hover:text-neonCyan transition-colors duration-300">
              [ TERMINATE CONNECTION ]
            </span>
          </button>
        </div>
      </section>
    </motion.div>
  );
}
