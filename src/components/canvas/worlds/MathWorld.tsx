"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normal;
  
  vec3 pos = position;
  float displacement = sin(pos.x * 3.0 + uTime) * cos(pos.y * 3.0 + uTime) * sin(pos.z * 3.0 + uTime);
  pos += normal * (displacement * 0.5);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec3 baseColor = vec3(0.0, 0.1, 0.5);
  vec3 highlightColor = vec3(0.0, 0.4, 1.0);
  
  float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
  vec3 finalColor = mix(baseColor, highlightColor, intensity);
  
  float grid = step(0.95, sin(vUv.x * 50.0)) + step(0.95, sin(vUv.y * 50.0));
  finalColor += grid * vec3(0.0, 1.0, 1.0) * 0.5;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default function MathWorld() {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} scale={3}>
      <icosahedronGeometry args={[1, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
}
