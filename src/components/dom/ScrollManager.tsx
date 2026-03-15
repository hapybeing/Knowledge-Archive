"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useStore } from "@/store/useStore";

export default function ScrollManager() {
  const setScrollProgress = useStore((state) => state.setScrollProgress);

  useEffect(() => {
    // Slower, more cinematic easing
    const lenis = new Lenis({
      duration: 1.5, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", (e: any) => {
      // Only drive the 3D camera if we are in the main universe
      if (useStore.getState().viewState === 'macro') {
        setScrollProgress(e.progress);
      }
    });

    return () => {
      lenis.destroy();
    };
  }, [setScrollProgress]);

  return null;
}
