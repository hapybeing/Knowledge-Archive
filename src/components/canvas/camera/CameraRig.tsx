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

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 15),
      new THREE.Vector3(2, 2, 0),
      new THREE.Vector3(-3, -1, -10),
      new THREE.Vector3(1, 4, -25),
      new THREE.Vector3(0, 0, -40),
    ]);
  }, []);

  useFrame(() => {
    if (viewState === 'macro' && !isTransitioning.current) {
      const point = curve.getPointAt(scrollProgress);
      const lookAtPoint = curve.getPointAt(Math.min(1, scrollProgress + 0.05));
      
      camera.position.lerp(point, 0.1);
      camera.lookAt(lookAtPoint);
    }
  });

  useEffect(() => {
    if (activeNode) {
      isTransitioning.current = true;
      const targetNode = universeData.find((n) => n.id === activeNode);
      if (!targetNode) return;

      const [x, y, z] = targetNode.coordinates;
      
      // PULL BACK to make it feel massive, and offset the camera X position
      // so the object ends up framed on the right side of the screen.
      const targetPosition = new THREE.Vector3(x - 2, y, z + 6); 
      const lookAtTarget = new THREE.Vector3(x - 2, y, z);

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setViewState("micro");
            isTransitioning.current = false;
          },
        });

        tl.to(camera as THREE.PerspectiveCamera, {
          fov: 110,
          duration: 0.8,
          ease: "power2.in",
          onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
        }, 0);

        tl.to(camera.position, {
          x: targetPosition.x,
          y: targetPosition.y,
          z: targetPosition.z,
          duration: 2.2,
          ease: "power4.inOut",
          onUpdate: () => camera.lookAt(lookAtTarget),
        }, 0);

        tl.to(camera as THREE.PerspectiveCamera, {
          fov: 45,
          duration: 1.0,
          ease: "power3.out",
          onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
        }, 1.2);
      });

      return () => ctx.revert();
    } else if (viewState === 'micro') {
      isTransitioning.current = true;
      const returnPoint = curve.getPointAt(scrollProgress);
      const returnLookAt = curve.getPointAt(Math.min(1, scrollProgress + 0.05));

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setViewState("macro");
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
          x: returnPoint.x,
          y: returnPoint.y,
          z: returnPoint.z,
          duration: 2.2,
          ease: "power4.inOut",
          onUpdate: () => camera.lookAt(returnLookAt),
        }, 0);

        tl.to(camera as THREE.PerspectiveCamera, {
          fov: 45,
          duration: 1.0,
          ease: "power3.out",
          onUpdate: () => (camera as THREE.PerspectiveCamera).updateProjectionMatrix(),
        }, 1.2);
      });

      return () => ctx.revert();
    }
  }, [activeNode, viewState, curve, scrollProgress, setViewState, camera]);

  return null;
}
