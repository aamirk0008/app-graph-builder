export type NodeStatus = 'Healthy' | 'Degraded' | 'Down'

export type NodeType = 'service' | 'database'

export interface ServiceNodeData extends Record<string, unknown> {
  label: string
  type: NodeType
  status: NodeStatus
  cost: string
  resourceValue: number
  description?: string
  provider?: 'aws' | 'gcp' | 'azure'
}

export interface App {
  id: string
  name: string
  color: string
  icon: string
}

export interface GraphNode {
  id: string
  type: 'serviceNode'
  position: { x: number; y: number }
  data: ServiceNodeData
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  animated?: boolean
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}