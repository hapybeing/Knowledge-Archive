"use client"

import universeData from '@/data/universe.json'
import KnowledgeNode from './KnowledgeNode'

export default function ConstellationGraph() {
  return (
    <group>
      {universeData.map((node) => (
        <KnowledgeNode
          key={node.id}
          id={node.id}
          position={node.coordinates as [number, number, number]}
          color={node.color}
        />
      ))}
    </group>
  )
}
