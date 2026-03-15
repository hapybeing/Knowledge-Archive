"use client"

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { NodeVertexShader, NodeFragmentShader } from '@/glsl/materials/NodeMaterial'
import { useStore } from '@/store/useStore'

interface KnowledgeNodeProps {
  id: string; position: [number, number, number]; color: string; title: string; category: string;
}

export default function KnowledgeNode({ id, position, color, title, category }: KnowledgeNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const htmlRef = useRef<HTMLDivElement>(null) // Direct DOM ref for performance
  
  const activeNode = useStore((state) => state.activeNode)
  const setActiveNode = useStore((state) => state.setActiveNode)
  const setViewState = useStore((state) => state.setViewState)
  const [hovered, setHovered] = useState(false)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
  }), [color])

  useFrame((state) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.z += 0.002

      const targetScale = activeNode === id ? 15 : (hovered && !activeNode ? 1.2 : 1);
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.04);

      // DYNAMIC HIDING: Only show the label if the camera is within 35 units
      if (htmlRef.current) {
        const dist = state.camera.position.distanceTo(meshRef.current.position);
        if (dist > 35) {
          htmlRef.current.style.opacity = '0';
          htmlRef.current.style.pointerEvents = 'none';
        } else {
          htmlRef.current.style.opacity = hovered ? '1' : '0.4';
          htmlRef.current.style.transform = hovered ? 'translateX(10px)' : 'translateX(0px)';
        }
      }
    }
  })

  const handlePointerOver = () => {
    if (!activeNode) {
      document.body.style.cursor = 'crosshair'; setHovered(true);
    }
  }

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto'; setHovered(false);
  }

  const handleClick = () => {
    if (activeNode) return
    setActiveNode(id); setViewState('transition');
    document.body.style.cursor = 'auto'; setHovered(false);
  }

  return (
    <group position={position}>
      <mesh ref={meshRef} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} onClick={handleClick}>
        <icosahedronGeometry args={[0.8, 32]} />
        <shaderMaterial ref={materialRef} vertexShader={NodeVertexShader} fragmentShader={NodeFragmentShader} uniforms={uniforms} transparent blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.FrontSide} />
      </mesh>
      
      <mesh onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} onClick={handleClick} visible={false}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial />
      </mesh>

      {!activeNode && (
        <Html position={[1.5, 0, 0]} center>
          <div ref={htmlRef} className="transition-all duration-300 ease-out flex flex-col gap-1" style={{ opacity: 0 }}>
            <span className="font-mono text-[8px] tracking-[0.4em] text-neonCyan uppercase whitespace-nowrap">
              {category} //
            </span>
            <span className="font-sans font-light text-xl tracking-tighter text-white uppercase whitespace-nowrap">
              {title}
            </span>
          </div>
        </Html>
      )}
    </group>
  )
}
