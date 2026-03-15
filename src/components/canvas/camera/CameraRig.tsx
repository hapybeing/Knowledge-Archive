"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { useStore } from "@/store/useStore";
import universeData from "@/data/universe.json";

export default function CameraRig() {
  const { camera } = useThree();
  const activeNode = useStore((state) => state.activeNode);
  const viewState = useStore((state) => state.viewState);
  const scrollProgress = useStore((state) => state.scrollProgress);
  const setViewState = useStore((state) => state.setViewState);
  
  const isTransitioning = useRef(false);

  // The lowest point the camera will travel (matching our lowest node)
  const maxDepth = -110; 

  useFrame(() => {
    if (viewState === 'macro' && !isTransitioning.current) {
      // Linearly map scroll (0 to 1) to the Y axis (0 to -110)
      const targetY = scrollProgress * maxDepth;
      
      const targetPosition = new THREE.Vector3(0, targetY, 15);
      const lookAtPoint = new THREE.Vector3(0, targetY, 0);
      
      // Subtle mouse sway
      const mouseX = (window.innerWidth / 2 - window.innerWidth) * 0.0005;
      const mouseY = (window.innerHeight / 2 - window.innerHeight) * 0.0005;
      lookAtPoint.x += mouseX;
      lookAtPoint.y += mouseY;

      camera.position.lerp(targetPosition, 0.1);
      camera.lookAt(lookAtPoint);
    }
  });

  useEffect(() => {
    if (activeNode) {
      isTransitioning.current = true;
      const targetNode = universeData.find((n) => n.id === activeNode);
      if (!targetNode) return;

      const [x, y, z] = targetNode.coordinates;
      
      // Dive slightly past the orb's center on the Z-axis
      const targetPosition = new THREE.Vector3(x, y, z + 6); 
      const lookAtTarget = new THREE.Vector3(x, y, z);

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setViewState("micro");
            isTransitioning.current = false;
          },
        });

        tl.to(camera as THREE.PerspectiveCamera, {
          fov: 90,
          duration: 0.6,
          ease: "power2.in",
          onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
        }, 0);

        tl.to(camera.position, {
          x: targetPosition.x,
          y: targetPosition.y,
          z: targetPosition.z,
          duration: 1.5,
          ease: "power3.inOut",
          onUpdate: () => camera.lookAt(lookAtTarget),
        }, 0);

        tl.to(camera as THREE.PerspectiveCamera, {
          fov: 45,
          duration: 0.6,
          ease: "power3.out",
          onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
        }, 0.9);
      });

      return () => ctx.revert();
    } else if (viewState === 'micro') {
      isTransitioning.current = true;
      const targetY = scrollProgress * maxDepth;
      const returnPosition = new THREE.Vector3(0, targetY, 15);
      const returnLookAt = new THREE.Vector3(0, targetY, 0);

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setViewState("macro");
            isTransitioning.current = false;
          },
        });

        tl.to(camera as THREE.PerspectiveCamera, {
          fov: 80,
          duration: 0.5,
          ease: "power2.in",
          onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
        }, 0);

        tl.to(camera.position, {
          x: returnPosition.x,
          y: returnPosition.y,
          z: returnPosition.z,
          duration: 1.5,
          ease: "power3.inOut",
          onUpdate: () => camera.lookAt(returnLookAt),
        }, 0);

        tl.to(camera as THREE.PerspectiveCamera, {
          fov: 45,
          duration: 0.6,
          ease: "power3.out",
          onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
        }, 0.9);
      });

      return () => ctx.revert();
    }
  }, [activeNode, viewState, scrollProgress, setViewState, camera]);

  return null;
}
