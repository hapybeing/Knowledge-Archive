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

  // Dynamically animate the chromatic aberration based on camera travel
  useFrame((state, delta) => {
    if (chromaticRef.current) {
      // High distortion during 'transition' (warp speed), subtle otherwise
      const targetOffset = viewState === 'transition' ? 0.04 : 0.002;
      
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
      {/* Threshold controls what glows. 
        MipmapBlur creates a cinematic, physically accurate light scatter.
      */}
      <Bloom 
        luminanceThreshold={0.2} 
        luminanceSmoothing={0.9} 
        intensity={1.5} 
        mipmapBlur 
      />
      
      {/* RGB split effect. Tied to the ref so we can animate it via useFrame.
      */}
      <ChromaticAberration 
        ref={chromaticRef}
        blendFunction={BlendFunction.NORMAL} 
        offset={new THREE.Vector2(0.002, 0.002)}
      />
      
      {/* Subtle film grain to prevent banding in dark areas */}
      <Noise 
        premultiply 
        blendFunction={BlendFunction.SCREEN} 
        opacity={0.3} 
      />
      
      {/* Darkens the edges to keep the user focused on the center */}
      <Vignette 
        eskil={false} 
        offset={0.1} 
        darkness={1.1} 
      />
    </EffectComposer>
  );
}
