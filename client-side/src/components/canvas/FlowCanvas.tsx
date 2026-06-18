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
// @ts-expect-error CSS module has no type declarations
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
  const { fitView } = useReactFlow()

const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  // When graph data arrives, load into ReactFlow and fit view
  useEffect(() => {
    if (data) {
      setNodes(data.nodes as Node[])
      setEdges(data.edges as Edge[])
      // Small delay so ReactFlow has time to render before fitting
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 400 })
      }, 50)
    }
  }, [data, setNodes, setEdges, fitView])

  // Clear selected node when app changes
  useEffect(() => {
    setSelectedNodeId(null)
  }, [selectedAppId, setSelectedNodeId])

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

  // Loading state
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

  // Error state
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
      <Controls
        className="!bottom-4 !left-4"
        showInteractive={false}
      />
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