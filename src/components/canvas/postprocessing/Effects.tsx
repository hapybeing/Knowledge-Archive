"use client";

import { EffectComposer, Bloom, Noise, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useStore } from '@/store/useStore';
import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Effects() {
  const viewState = useStore((state) => state.viewState);
  const chromaticRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (chromaticRef.current) {
      const targetOffset = viewState === 'transition' ? 0.04 : 0.0015; // Toned down resting aberration
      
      chromaticRef.current.offset.x = THREE.MathUtils.lerp(
        chromaticRef.current.offset.x, 
        targetOffset, 
        delta * 4
      );
      chromaticRef.current.offset.y = THREE.MathUtils.lerp(
        chromaticRef.current.offset.y, 
        targetOffset, 
        delta * 4
      );
    }
  });

  return (
    <EffectComposer disableNormalPass multisampling={0}>
      {/* Toned down intensity, raised threshold. Only the core glows now. */}
      <Bloom 
        luminanceThreshold={0.6} 
        luminanceSmoothing={0.9} 
        intensity={0.8} 
        mipmapBlur 
      />
      
      <ChromaticAberration 
        ref={chromaticRef}
        blendFunction={BlendFunction.NORMAL} 
        offset={new THREE.Vector2(0.0015, 0.0015)}
      />
      
      {/* Increased grain slightly for texture */}
      <Noise 
        premultiply 
        blendFunction={BlendFunction.SCREEN} 
        opacity={0.4} 
      />
      
      {/* Much heavier vignette to create a spotlight effect in the center/right */}
      <Vignette 
        eskil={false} 
        offset={0.2} 
        darkness={1.5} 
      />
    </EffectComposer>
  );
}
