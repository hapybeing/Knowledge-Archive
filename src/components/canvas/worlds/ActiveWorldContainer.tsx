"use client";

import { useStore } from "@/store/useStore";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const PhysicsWorld = dynamic(() => import("./PhysicsWorld"), { ssr: false });
const AIWorld = dynamic(() => import("./AIWorld"), { ssr: false });
const MathWorld = dynamic(() => import("./MathWorld"), { ssr: false });

export default function ActiveWorldContainer() {
  const activeNode = useStore((state) => state.activeNode);

  if (!activeNode) return null;

  return (
    <Suspense fallback={null}>
      {activeNode === "physics" && <PhysicsWorld />}
      {activeNode === "ai" && <AIWorld />}
      {activeNode === "mathematics" && <MathWorld />}
    </Suspense>
  );
}
