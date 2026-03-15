"use client";

import { motion } from "framer-motion";

interface SplitTextProps {
  text: string;
  className?: string;
  highlightWords?: string[];
  delay?: number;
}

export default function SplitText({ text, className = "", highlightWords = [], delay = 0 }: SplitTextProps) {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
  };

  return (
    <motion.div
      style={{ display: "flex", flexWrap: "wrap", gap: "0.25em" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className={className}
    >
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
        const isHighlight = highlightWords.includes(cleanWord);

        return (
          <motion.span
            variants={child}
            key={index}
            className={isHighlight ? "text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-blue-500 font-medium" : ""}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.div>
  );
}
