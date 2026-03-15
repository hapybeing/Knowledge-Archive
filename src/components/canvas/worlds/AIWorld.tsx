"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

const aiVertexShader = `
uniform float uTime;
varying float vDistance;

void main() {
  vec3 pos = position;
  
  // Create a swirling, data-stream effect
  float angle = uTime * 0.2 + pos.y * 0.5;
  float s = sin(angle);
  float c = cos(angle);
  
  pos.x = position.x * c - position.z * s;
  pos.z = position.x * s + position.z * c;
  
  // Pulse the points outwards based on sine waves
  float pulse = sin(pos.y * 2.0 + uTime * 2.0) * 0.5 + 0.5;
  pos += normal * (pulse * 0.2);
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  // Calculate distance for depth fading in the fragment shader
  vDistance = -mvPosition.z;
  
  // Points closer to camera are larger, further are smaller
  gl_PointSize = (20.0 / vDistance);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const aiFragmentShader = `
varying float vDistance;

void main() {
  // Make the points circular instead of square
  vec2 xy = gl_PointCoord.xy - vec2(0.5);
  float ll = length(xy);
  if(ll > 0.5) discard;
  
  // Cybernetic color palette (Neon Cyan to Deep Violet)
  vec3 colorA = vec3(0.0, 0.95, 1.0);
  vec3 colorB = vec3(0.69, 0.15, 1.0);
  
  // Mix colors based on depth
  float mixVal = smoothstep(2.0, 10.0, vDistance);
  vec3 finalColor = mix(colorA, colorB, mixVal);
  
  // Soft edges
  float alpha = (1.0 - (ll * 2.0)) * 0.8;
  
  gl_FragColor = vec4(finalColor, alpha);
}
`;

export default function AIWorld() {
  const pointsRef = useRef<THREE.Points>(null);
  const activeNode = useStore((state) => state.activeNode);

  // Generate a massive sphere of neural points
  const particlesCount = 30000;
  const { positions, normals } = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const norm = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
      // Spherical distribution
      const r = 1.5 + Math.random() * 2.5; 
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      
      // Normals facing outward for the pulse expansion
      const normal = new THREE.Vector3(x, y, z).normalize();
      norm[i * 3] = normal.x;
      norm[i * 3 + 1] = normal.y;
      norm[i * 3 + 2] = normal.z;
    }
    return { positions: pos, normals: norm };
  }, []);

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      
      // Slow, deliberate rotation of the entire data core
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.2;
    }
  });

  // Only render if we are actually inside the AI node to save GPU power
  if (activeNode !== 'ai') return null;

  // We offset the world to match where the camera stopped in the CameraRig
  return (
    <group position={[4, -1, -15]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particlesCount} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-normal" count={particlesCount} array={normals} itemSize={3} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={aiVertexShader}
          fragmentShader={aiFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
