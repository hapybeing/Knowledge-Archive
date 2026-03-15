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

  // Custom rich lore depending on the node selected
  const lore = activeNode === 'physics' ? {
    hero: "At the edge of observation, reality breaks down into probability. We are not looking at matter; we are looking at the math that dreams of matter.",
    timeline: [
      { year: "1900", title: "THE QUANTUM LEAP", desc: "Energy is not a continuous wave. It is quantized. The universe stutters into existence in discrete, violent packets of light." },
      { year: "1927", title: "UNCERTAINTY", desc: "To know the velocity is to lose the position. The observer becomes entangled with the observed. The architecture of reality is fundamentally blurred." },
      { year: "1964", title: "ENTANGLEMENT", desc: "Distance is an illusion. Two particles, separated by galaxies, share the exact same heartbeat. Spooky action at a distance becomes structural law." }
    ]
  } : {
    hero: "Silicon mimics the synapse. We taught the sand to think, and now it builds architectures we can no longer fully comprehend.",
    timeline: [
      { year: "1956", title: "THE INCEPTION", desc: "The premise was simple: a machine that could simulate human reasoning. The logic gates were drawn, the first algorithms breathed life." },
      { year: "2017", title: "THE TRANSFORMER", desc: "Attention is all you need. The network learned context, sequence, and meaning. It stopped parsing data and started understanding language." },
      { year: "2026", title: "SYNTHETIC INTUITION", desc: "The models no longer just predict; they infer. The neural pathways rival organic complexity, generating solutions born from the black box." }
    ]
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute top-0 left-0 w-full z-30 pt-[30vh] pb-32"
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24">
        
        {/* 1. HERO SECTION */}
        <section className="relative w-full min-h-[70vh] flex flex-col justify-start">
          <div className="max-w-2xl">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="font-mono text-neonCyan text-[10px] tracking-[0.5em] uppercase mb-8"
            >
              {data.category} DISCIPLINE //
            </motion.p>
            
            <SplitText 
              text={data.title}
              className="text-5xl md:text-7xl lg:text-9xl font-light tracking-tighter uppercase leading-[0.9] text-white mb-12"
              delay={0.2}
            />
            
            <div className="mt-8 border-l border-neonCyan pl-6">
              <SplitText 
                text={lore.hero}
                className="text-white/70 font-sans text-lg md:text-2xl font-light leading-relaxed"
                highlightWords={["probability.", "math", "matter.", "synapse.", "comprehend."]}
                delay={0.8}
              />
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="mt-32 font-mono text-[10px] tracking-[0.4em] text-white/30"
          >
            SCROLL TO DESCEND INTO LORE ↓
          </motion.div>
        </section>

        {/* 2. THE TIMELINE (SCROLL TRIGGERED) */}
        <section className="relative w-full mt-40">
          <motion.h3 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: false, margin: "-10%" }}
            className="font-mono text-xs tracking-[0.4em] text-white/50 uppercase mb-24"
          >
            [ HISTORICAL TOPOLOGY ]
          </motion.h3>

          <div className="flex flex-col gap-32 relative">
            {/* The glowing backbone line */}
            <div className="absolute top-0 left-[15px] md:left-[23px] w-[1px] h-full bg-gradient-to-b from-neonCyan via-violet to-transparent opacity-50" />

            {lore.timeline.map((event, i) => (
              <motion.div 
                key={i}
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false, margin: "-20%" }}
                className="relative pl-12 md:pl-24 max-w-3xl"
              >
                {/* Glowing Node on the line */}
                <div className="absolute top-2 left-0 w-8 h-8 rounded-full bg-black border border-neonCyan flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-neonCyan shadow-[0_0_10px_#00f3ff]" />
                </div>

                <p className="font-mono text-neonCyan text-sm tracking-[0.2em] mb-4">{event.year}</p>
                <h4 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-6 uppercase">
                  {event.title}
                </h4>
                <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed">
                  {event.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. EXIT PROTOCOL */}
        <section className="relative w-full mt-64 mb-32 border-t border-white/10 pt-24">
          <motion.div 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: false }}
          >
            <button 
              onClick={() => setActiveNode(null)}
              className="group relative px-12 py-6 overflow-hidden border border-white/20 hover:border-neonCyan transition-colors duration-700 bg-[#010103]/50 backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neonCyan/20 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out" />
              <span className="relative z-10 font-mono text-[10px] md:text-xs tracking-[0.4em] text-white group-hover:text-neonCyan transition-colors duration-300">
                [ TERMINATE CONNECTION & RETURN TO ARCHIVE ]
              </span>
            </button>
          </motion.div>
        </section>

      </div>
    </motion.div>
  );
}
