"use client";

import { useEffect, useMemo, useRef } from "react";
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

  // Updated curve to match the new deep-space coordinates
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 15),               // Start (Clean view, no orbs)
      new THREE.Vector3(1, 2, -40 + 6),          // Physics approach
      new THREE.Vector3(-6, -1, -80 + 6),        // AI approach
      new THREE.Vector3(0, 3, -120 + 6),         // Math approach
      new THREE.Vector3(-5, 1, -160 + 6),        // Cybernetics approach
      new THREE.Vector3(-2, -2, -200 + 6),       // Cosmology approach
      new THREE.Vector3(0, 0, -240),             // Deep space end
    ]);
  }, []);

  useFrame(() => {
    if (viewState === 'macro' && !isTransitioning.current) {
      const point = curve.getPointAt(scrollProgress);
      const lookAtPoint = curve.getPointAt(Math.min(1, scrollProgress + 0.02));
      
      camera.position.lerp(point, 0.08); 
      
      const mouseX = (window.innerWidth / 2 - window.innerWidth) * 0.0005;
      const mouseY = (window.innerHeight / 2 - window.innerHeight) * 0.0005;
      lookAtPoint.x += mouseX;
      lookAtPoint.y += mouseY;
      
      camera.lookAt(lookAtPoint);
    }
  });

  useEffect(() => {
    if (activeNode) {
      isTransitioning.current = true;
      const targetNode = universeData.find((n) => n.id === activeNode);
      if (!targetNode) return;

      const [x, y, z] = targetNode.coordinates;
      
      // Pushes the orb to the right side of the screen when clicked
      const targetPosition = new THREE.Vector3(x + 4, y, z + 6); 
      const lookAtTarget = new THREE.Vector3(x + 4, y, z);

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setViewState("micro");
            isTransitioning.current = false;
          },
        });

        tl.to(camera as THREE.PerspectiveCamera, {
          fov: 90,
          duration: 0.8,
          ease: "power2.in",
          onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
        }, 0);

        tl.to(camera.position, {
          x: targetPosition.x,
          y: targetPosition.y,
          z: targetPosition.z,
          duration: 1.8,
          ease: "power3.inOut",
          onUpdate: () => camera.lookAt(lookAtTarget),
        }, 0);

        tl.to(camera as THREE.PerspectiveCamera, {
          fov: 45,
          duration: 0.8,
          ease: "power3.out",
          onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
        }, 1.0);
      });

      return () => ctx.revert();
    } else if (viewState === 'micro') {
      isTransitioning.current = true;
      const returnPoint = curve.getPointAt(scrollProgress);
      const returnLookAt = curve.getPointAt(Math.min(1, scrollProgress + 0.02));

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setViewState("macro");
            isTransitioning.current = false;
          },
        });

        tl.to(camera as THREE.PerspectiveCamera, {
          fov: 80,
          duration: 0.6,
          ease: "power2.in",
          onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
        }, 0);

        tl.to(camera.position, {
          x: returnPoint.x,
          y: returnPoint.y,
          z: returnPoint.z,
          duration: 1.8,
          ease: "power3.inOut",
          onUpdate: () => camera.lookAt(returnLookAt),
        }, 0);

        tl.to(camera as THREE.PerspectiveCamera, {
          fov: 45,
          duration: 0.8,
          ease: "power3.out",
          onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
        }, 1.0);
      });

      return () => ctx.revert();
    }
  }, [activeNode, viewState, curve, scrollProgress, setViewState, camera]);

  return null;
}
