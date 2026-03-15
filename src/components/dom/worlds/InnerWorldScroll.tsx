// --- PREMIUM GENERATIVE AESTHETIC COMPONENT ---
const RevealImage = ({ color }: { color: string }) => (
  <motion.div 
    whileInView={{ opacity: 1, filter: "brightness(1)" }}
    initial={{ opacity: 0, filter: "brightness(0.2)" }}
    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
    viewport={{ once: true, margin: "-10%" }}
    className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden my-16 border border-white/5 bg-black"
  >
    {/* Animated CSS deep space gradient to replace external images */}
    <motion.div 
      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${color}22 0%, #010103 70%)`
      }}
    />
    {/* Grid overlay for FWA tech vibe */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#010103] via-transparent to-transparent" />
  </motion.div>
);
