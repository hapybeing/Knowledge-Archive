"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useStore } from "@/store/useStore";
import universeData from "@/data/universe.json";
import * as THREE from "three";

export default function CameraRig() {
  const { camera } = useThree();
  const activeNode = useStore((state) => state.activeNode);
  const setViewState = useStore((state) => state.setViewState);

  useEffect(() => {
    if (activeNode) {
      const targetNode = universeData.find((n) => n.id === activeNode);
      if (!targetNode) return;

      const [x, y, z] = targetNode.coordinates;
      const targetPosition = new THREE.Vector3(x, y, z + 3.5);
      const lookAtTarget = new THREE.Vector3(x, y, z);

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => setViewState("micro"),
        });

        tl.to(
          camera as THREE.PerspectiveCamera,
          {
            fov: 110,
            duration: 0.8,
            ease: "power2.in",
            onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
          },
          0
        );

        tl.to(
          camera.position,
          {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2.2,
            ease: "power4.inOut",
            onUpdate: () => camera.lookAt(lookAtTarget),
          },
          0
        );

        tl.to(
          camera as THREE.PerspectiveCamera,
          {
            fov: 45,
            duration: 1.0,
            ease: "power3.out",
            onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
          },
          1.2
        );
      });

      return () => ctx.revert();
    } else {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => setViewState("macro"),
        });

        tl.to(
          camera as THREE.PerspectiveCamera,
          {
            fov: 90,
            duration: 0.6,
            ease: "power2.in",
            onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
          },
          0
        );

        tl.to(
          camera.position,
          {
            x: 0,
            y: 0,
            z: 15,
            duration: 2.2,
            ease: "power4.inOut",
            onUpdate: () => camera.lookAt(0, 0, 0),
          },
          0
        );

        tl.to(
          camera as THREE.PerspectiveCamera,
          {
            fov: 45,
            duration: 1.0,
            ease: "power3.out",
            onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
          },
          1.2
        );
      });

      return () => ctx.revert();
    }
  }, [activeNode, camera, setViewState]);

  return null;
}
