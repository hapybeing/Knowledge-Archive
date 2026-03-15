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
  const { setActiveNode, setViewState } = useStore()

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
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.z += 0.002
    }
  })

  const handlePointerOver = () => {
    document.body.style.cursor = 'crosshair'
  }

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto'
  }

  const handleClick = () => {
    setActiveNode(id)
    setViewState('transition')
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
