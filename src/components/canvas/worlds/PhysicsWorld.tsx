"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
uniform float uTime;
varying float vZ;

void main() {
  vec3 pos = position;
  float noiseFreq = 0.5;
  float noiseAmp = 2.0;
  
  pos.z += sin(pos.x * noiseFreq + uTime) * noiseAmp;
  pos.z += cos(pos.y * noiseFreq + uTime) * noiseAmp;
  
  vZ = pos.z;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = (15.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying float vZ;

void main() {
  vec2 xy = gl_PointCoord.xy - vec2(0.5);
  float ll = length(xy);
  if(ll > 0.5) discard;
  
  vec3 colorA = vec3(0.0, 0.95, 1.0);
  vec3 colorB = vec3(0.0, 0.1, 0.8);
  
  float mixVal = (vZ + 4.0) / 8.0;
  vec3 finalColor = mix(colorB, colorA, clamp(mixVal, 0.0, 1.0));
  
  gl_FragColor = vec4(finalColor, 1.0 - (ll * 2.0));
}
`;

export default function PhysicsWorld() {
  const pointsRef = useRef<THREE.Points>(null);

  const particlesCount = 20000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime * 2.0;
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
