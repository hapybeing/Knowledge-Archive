"use client";

import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import SplitText from "../ui/SplitText";
import universeData from "@/data/universe.json";

// --- PREMIUM IMAGE REVEAL COMPONENT ---
const RevealImage = ({ src, alt }: { src: string, alt: string }) => (
  <motion.div 
    whileInView={{ opacity: 1, filter: "brightness(1)" }}
    initial={{ opacity: 0, filter: "brightness(0.2)" }}
    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    viewport={{ once: true, margin: "-10%" }}
    className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden my-16 border border-white/10"
  >
    <motion.img 
      whileInView={{ scale: 1 }}
      initial={{ scale: 1.2 }}
      transition={{ duration: 2, ease: "easeOut" }}
      src={src} 
      alt={alt}
      className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#010103] via-transparent to-transparent" />
  </motion.div>
);

// --- THE MASTER LORE DATABASE ---
const loreData: Record<string, any> = {
  physics: {
    hero: "At the edge of observation, reality breaks down into probability. We are not looking at matter; we are looking at the math that dreams of matter.",
    quote: "God does not play dice with the universe. Or perhaps, the universe is nothing but the dice.",
    image: "https://images.unsplash.com/photo-1633469924738-52101af51d87?q=80&w=2000&auto=format&fit=crop", // Abstract dark particles
    timeline: [
      { year: "1900", title: "THE QUANTUM LEAP", desc: "Energy is not a continuous wave. It is quantized. The universe stutters into existence in discrete, violent packets of light." },
      { year: "1927", title: "UNCERTAINTY", desc: "To know the velocity is to lose the position. The observer becomes entangled with the observed. The architecture of reality is fundamentally blurred." },
      { year: "1964", title: "ENTANGLEMENT", desc: "Distance is an illusion. Two particles, separated by galaxies, share the exact same heartbeat. Spooky action at a distance becomes structural law." }
    ]
  },
  ai: {
    hero: "Silicon mimics the synapse. We taught the sand to think, and now it builds architectures we can no longer fully comprehend.",
    quote: "The question of whether a computer can think is no more interesting than the question of whether a submarine can swim.",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2000&auto=format&fit=crop", // Dark volumetric fog/server
    timeline: [
      { year: "1956", title: "THE INCEPTION", desc: "The premise was simple: a machine that could simulate human reasoning. The logic gates were drawn, the first algorithms breathed life." },
      { year: "2017", title: "THE TRANSFORMER", desc: "Attention is all you need. The network learned context, sequence, and meaning. It stopped parsing data and started understanding language." },
      { year: "2026", title: "SYNTHETIC INTUITION", desc: "The models no longer just predict; they infer. The neural pathways rival organic complexity, generating solutions born from the black box." }
    ]
  },
  mathematics: {
    hero: "The language of the cosmos is written in geometry. Behind the chaos of nature lies a perfect, endlessly repeating equation.",
    quote: "Pure mathematics is, in its way, the poetry of logical ideas.",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop", // Dark architectural geometry
    timeline: [
      { year: "300 BC", title: "THE ELEMENTS", desc: "Euclid bounds the world in lines and planes. The foundation of absolute, indisputable proof is established." },
      { year: "1854", title: "CURVED SPACE", desc: "Riemann breaks the grid. Geometry is freed from the flat plane, allowing us to describe the warping of spacetime itself." },
      { year: "1975", title: "THE FRACTAL", desc: "Mandelbrot reveals the infinite coastlines. Zooming in does not simplify the shape; it reveals a universe exactly as complex as the whole." }
    ]
  },
  cybernetics: {
    hero: "A real-time global intelligence nexus. We are no longer individuals using tools; we are nodes in a continuously evolving planetary dashboard.",
    quote: "The interface is the mind. We shape our tools, and thereafter our tools shape us.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop", // Dark cybernetic matrix code/abstract
    timeline: [
      { year: "1948", title: "CONTROL & COMMUNICATION", desc: "Wiener defines the loop. Systems that measure their own output to adjust their future behavior. The birth of automated equilibrium." },
      { year: "1994", title: "THE WORLD WIDE WEB", desc: "The isolated nodes connect. Information ceases to be static and becomes a flowing, decentralized river of human consciousness." },
      { year: "2026", title: "THE OMNI-DASHBOARD", desc: "Surveillance, intelligence, and response merge into a single, fluid interface. The system anticipates the crisis before the human perceives the threat." }
    ]
  },
  cosmology: {
    hero: "Mapping the absolute dark. From the singular point of the big bang to the cosmic web that strings galaxies together like dew on a spider's thread.",
    quote: "We are a way for the cosmos to know itself.",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop", // Deep dark space/nebula
    timeline: [
      { year: "1929", title: "THE EXPANSION", desc: "Hubble observes the redshift. The universe is not static; it is fleeing from itself in all directions. The beginning implies an end." },
      { year: "1964", title: "THE ECHO", desc: "The cosmic microwave background is detected. The literal afterglow of creation, a whisper from 13.8 billion years ago caught in a radio antenna." },
      { year: "2021", title: "THE DEEP FIELD", desc: "The Webb mirror unfolds. We peer through the dust of nebulas to see the very first stars violently igniting in the primordial dark." }
    ]
  }
};

export default function InnerWorldScroll() {
  const activeNode = useStore((state) => state.activeNode);
  const setActiveNode = useStore((state) => state.setActiveNode);
  
  const data = universeData.find((n) => n.id === activeNode);
  if (!data || !activeNode) return null;

  const currentLore = loreData[activeNode];

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
          <div className="max-w-3xl">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="font-mono text-neonCyan text-[10px] tracking-[0.5em] uppercase mb-8"
            >
              {data.category} // ARCHIVE.SYS
            </motion.p>
            
            <SplitText 
              text={data.title}
              className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter uppercase leading-[0.9] text-white mb-12 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              delay={0.2}
            />
            
            <div className="mt-8 border-l-2 border-neonCyan pl-6 md:pl-10">
              <SplitText 
                text={currentLore.hero}
                className="text-white font-sans text-xl md:text-3xl font-light leading-relaxed"
                highlightWords={["probability.", "math", "matter.", "synapse.", "comprehend.", "geometry.", "dashboard.", "cosmos"]}
                delay={0.8}
              />
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="mt-32 font-mono text-[10px] tracking-[0.4em] text-neonCyan animate-pulse"
          >
            SCROLL TO DECRYPT LORE ↓
          </motion.div>
        </section>

        {/* 2. CINEMATIC ELEGANCE & IMAGE REVEAL */}
        <section className="relative w-full mt-32">
          <RevealImage src={currentLore.image} alt={data.title} />
          
          <motion.div 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            viewport={{ once: true, margin: "-20%" }}
            className="max-w-4xl mx-auto text-center mt-24 mb-40"
          >
            {/* The Shift to Elegant Serif Typography */}
            <h2 className="font-serif italic text-3xl md:text-5xl lg:text-6xl text-white/90 leading-tight tracking-wide">
              "{currentLore.quote}"
            </h2>
          </motion.div>
        </section>

        {/* 3. THE GLOWING TIMELINE */}
        <section className="relative w-full mt-12">
          <motion.h3 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: false, margin: "-10%" }}
            className="font-mono text-[10px] tracking-[0.5em] text-white/50 uppercase mb-32"
          >
            [ HISTORICAL TOPOLOGY ]
          </motion.h3>

          <div className="flex flex-col gap-40 relative pb-24">
            {/* The glowing backbone line */}
            <div className="absolute top-0 left-[15px] md:left-[23px] w-[1px] h-full bg-gradient-to-b from-neonCyan via-violet to-transparent opacity-40" />

            {currentLore.timeline.map((event: any, i: number) => (
              <motion.div 
                key={i}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                initial={{ opacity: 0, x: 40, filter: "blur(10px)" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: false, margin: "-20%" }}
                className="relative pl-12 md:pl-32 max-w-4xl"
              >
                {/* Glowing Node on the line */}
                <div className="absolute top-2 left-0 w-8 h-8 rounded-full bg-[#010103] border-2 border-neonCyan flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_15px_#00f3ff]" />
                </div>

                <p className="font-mono text-neonCyan text-xs tracking-[0.3em] mb-6">{event.year}</p>
                <h4 className="text-4xl md:text-6xl font-light text-white tracking-tighter mb-8 uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  {event.title}
                </h4>
                <p className="text-white/60 text-lg md:text-2xl font-light leading-relaxed font-sans">
                  {event.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. PREMIUM EXIT PROTOCOL */}
        <section className="relative w-full mt-32 pt-32 border-t border-white/10 flex justify-center">
          <motion.div 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
            viewport={{ once: false }}
          >
            <button 
              onClick={() => setActiveNode(null)}
              className="group relative px-16 py-8 overflow-hidden border border-white/20 hover:border-neonCyan transition-all duration-700 bg-black backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neonCyan/20 to-violet/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
              <span className="relative z-10 font-mono text-xs md:text-sm tracking-[0.4em] text-white group-hover:text-white transition-colors duration-300">
                [ TERMINATE SECURE CONNECTION ]
              </span>
            </button>
          </motion.div>
        </section>

      </div>
    </motion.div>
  );
}
