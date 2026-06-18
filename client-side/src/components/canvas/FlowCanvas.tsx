import { useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type OnConnect,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ServiceNode } from './ServiceNode'
import { useAppStore } from '@/store/appStore'
import { useGraph } from '@/hooks/useGraph'
import { Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const nodeTypes = { serviceNode: ServiceNode }

function CanvasInner() {
  const { selectedAppId, setSelectedNodeId } = useAppStore()
  const { data, isLoading, isError, refetch } = useGraph(selectedAppId)
  const { fitView, screenToFlowPosition } = useReactFlow()

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  // Load graph data when it arrives
  useEffect(() => {
    if (data) {
      setNodes(data.nodes as Node[])
      setEdges(data.edges as Edge[])
      setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 50)
    }
  }, [data, setNodes, setEdges, fitView])

  // Clear selected node when app changes
  useEffect(() => {
    setSelectedNodeId(null)
  }, [selectedAppId, setSelectedNodeId])

  // F key → fit view
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase()
      if (['input', 'textarea', 'select'].includes(tag)) return
      if (e.key === 'f' || e.key === 'F') {
        fitView({ padding: 0.2, duration: 400 })
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [fitView])

  const onConnect = useCallback<OnConnect>(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id)
    },
    [setSelectedNodeId]
  )

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null)
  }, [setSelectedNodeId])

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      const deletedIds = new Set(deleted.map((n) => n.id))
      const { selectedNodeId } = useAppStore.getState()
      if (selectedNodeId && deletedIds.has(selectedNodeId)) {
        setSelectedNodeId(null)
      }
    },
    [setSelectedNodeId]
  )

  // Add Node — creates a new service node at canvas center
  const addNode = useCallback(() => {
    const id = `node-${Date.now()}`
    const position = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    })
    const newNode: Node = {
      id,
      type: 'serviceNode',
      position,
      data: {
        label: 'New Service',
        type: 'service',
        status: 'Healthy',
        cost: '$0.01/HR',
        resourceValue: 0,
        provider: 'aws',
      },
    }
    setNodes((nds) => [...nds, newNode])
    setSelectedNodeId(id)
  }, [screenToFlowPosition, setNodes, setSelectedNodeId])

  // Expose addNode to TopBar via store
  useEffect(() => {
    useAppStore.setState({ addNode })
  }, [addNode])

  if (isLoading) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-3"
        style={{
          backgroundImage: 'radial-gradient(circle, #2a2a4a 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <Loader2 size={28} className="text-purple-400 animate-spin" />
        <p className="text-sm text-[--color-muted-foreground]">Loading graph...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-3"
        style={{
          backgroundImage: 'radial-gradient(circle, #2a2a4a 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <AlertCircle size={28} className="text-red-400" />
        <p className="text-sm text-[--color-muted-foreground]">Failed to load graph</p>
        <Button variant="outline" size="sm" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      onNodesDelete={onNodesDelete}
      nodeTypes={nodeTypes}
      deleteKeyCode={['Backspace', 'Delete']}
      fitView
      proOptions={{ hideAttribution: true }}
      className="bg-[#0d0d1a]"
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color="#2a2a4a"
      />
      <Controls showInteractive={false} />
    </ReactFlow>
  )
}

export function FlowCanvas() {
  return (
    <div className="w-full h-full">
      <CanvasInner />
    </div>
  )
}