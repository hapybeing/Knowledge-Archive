"use client"

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NodeVertexShader, NodeFragmentShader } from '@/glsl/materials/NodeMaterial'
import { useStore } from '@/store/useStore'

interface KnowledgeNodeProps {
  id: string
  position: [number, number, number]
  color: string
}

export default function KnowledgeNode({ id, position, color }: KnowledgeNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const activeNode = useStore((state) => state.activeNode)
  const setActiveNode = useStore((state) => state.setActiveNode)
  const setViewState = useStore((state) => state.setViewState)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
    }),
    [color]
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
    
    if (meshRef.current) {
      // Rotate the shell
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.z += 0.002

      // THE MAGIC TRICK:
      // If this node is clicked, scale it up massively (to 15).
      // The camera will pass through the geometry, making the shell invisible 
      // and revealing the high-end micro-world inside.
      const targetScale = activeNode === id ? 15 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale), 
        0.04
      );
    }
  })

  const handlePointerOver = () => {
    if (!activeNode) document.body.style.cursor = 'crosshair'
  }

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto'
  }

  const handleClick = () => {
    if (activeNode) return; // Prevent clicking if already inside
    setActiveNode(id)
    setViewState('transition')
    document.body.style.cursor = 'auto'
  }

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <icosahedronGeometry args={[0.8, 32]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={NodeVertexShader}
          fragmentShader={NodeFragmentShader}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.FrontSide} // Ensures it becomes invisible when we are inside it
        />
      </mesh>
      
      <mesh
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        visible={false}
      >
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  )
}
