"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function FounderModal() {
  const contactOpen = useStore((state) => state.contactOpen);
  const setContactOpen = useStore((state) => state.setContactOpen);

  return (
    <AnimatePresence>
      {contactOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#010103]/80 backdrop-blur-xl p-4"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="relative w-full max-w-lg border border-white/10 bg-black p-12 overflow-hidden"
          >
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-neonCyan" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-neonCyan" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-neonCyan" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-neonCyan" />

            <button 
              onClick={() => setContactOpen(false)}
              className="absolute top-6 right-6 text-white/50 hover:text-white font-mono text-xs tracking-widest transition-colors"
            >
              [CLOSE]
            </button>

            <h3 className="font-mono text-neonCyan text-[10px] tracking-[0.4em] uppercase mb-2">
              CREATIVE DIRECTOR
            </h3>
            <h2 className="text-4xl font-light text-white tracking-tighter mb-8 uppercase">
              Gaurang
            </h2>

            <div className="flex flex-col gap-6">
              <a 
                href="https://instagram.com/yaytwenty26" 
                target="_blank" 
                rel="noreferrer"
                className="group flex justify-between items-center border-b border-white/10 pb-4 hover:border-neonCyan transition-colors duration-300"
              >
                <span className="font-mono text-xs tracking-[0.2em] text-white/50 group-hover:text-white transition-colors">
                  INSTAGRAM
                </span>
                <span className="font-sans text-sm text-white group-hover:text-neonCyan transition-colors">
                  @hapybeing1 ↗
                </span>
              </a>

              <a 
                href="mailto:contact@example.com" 
                className="group flex justify-between items-center border-b border-white/10 pb-4 hover:border-neonCyan transition-colors duration-300"
              >
                <span className="font-mono text-xs tracking-[0.2em] text-white/50 group-hover:text-white transition-colors">
                  COMMUNICATIONS
                </span>
                <span className="font-sans text-sm text-white group-hover:text-neonCyan transition-colors">
                  SECURE COMMS ↗
                </span>
              </a>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
