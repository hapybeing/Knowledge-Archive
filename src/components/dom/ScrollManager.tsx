"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useStore } from "@/store/useStore";

export default function ScrollManager() {
  const setScrollProgress = useStore((state) => state.setScrollProgress);
  const viewState = useStore((state) => state.viewState);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenis.on("scroll", (e: any) => {
      setScrollProgress(e.progress);
    });

    if (viewState !== "macro") {
      lenis.stop();
    } else {
      lenis.start();
    }

    return () => {
      lenis.destroy();
    };
  }, [viewState, setScrollProgress]);

  return null;
}
