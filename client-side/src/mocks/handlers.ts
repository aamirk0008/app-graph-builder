import { http, HttpResponse, delay } from 'msw'
import type { App, GraphData } from '@/types'

const apps: App[] = [
  { id: 'app-1', name: 'supertokens-golang', color: '#7C3AED', icon: 'G' },
  { id: 'app-2', name: 'supertokens-java',   color: '#6366F1', icon: 'J' },
  { id: 'app-3', name: 'supertokens-python', color: '#EF4444', icon: 'P' },
  { id: 'app-4', name: 'supertokens-ruby',   color: '#8B5CF6', icon: 'R' },
  { id: 'app-5', name: 'supertokens-go',     color: '#A855F7', icon: 'G' },
]

const graphs: Record<string, GraphData> = {
  'app-1': {
    nodes: [
      {
        id: 'n1', type: 'serviceNode',
        position: { x: 80, y: 60 },
        data: { label: 'API Gateway', type: 'service', status: 'Healthy', cost: '$0.03/HR', resourceValue: 42, provider: 'aws' },
      },
      {
        id: 'n2', type: 'serviceNode',
        position: { x: 480, y: 40 },
        data: { label: 'Postgres', type: 'database', status: 'Healthy', cost: '$0.03/HR', resourceValue: 65, provider: 'aws' },
      },
      {
        id: 'n3', type: 'serviceNode',
        position: { x: 160, y: 320 },
        data: { label: 'Redis', type: 'database', status: 'Down', cost: '$0.03/HR', resourceValue: 28, provider: 'aws' },
      },
      {
        id: 'n4', type: 'serviceNode',
        position: { x: 500, y: 360 },
        data: { label: 'MongoDB', type: 'database', status: 'Degraded', cost: '$0.03/HR', resourceValue: 80, provider: 'aws' },
      },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', animated: true },
      { id: 'e2', source: 'n1', target: 'n3', animated: false },
      { id: 'e3', source: 'n2', target: 'n4', animated: false },
    ],
  },
  'app-2': {
    nodes: [
      {
        id: 'n1', type: 'serviceNode',
        position: { x: 100, y: 80 },
        data: { label: 'Auth Service', type: 'service', status: 'Healthy', cost: '$0.05/HR', resourceValue: 55, provider: 'aws' },
      },
      {
        id: 'n2', type: 'serviceNode',
        position: { x: 420, y: 80 },
        data: { label: 'MySQL', type: 'database', status: 'Healthy', cost: '$0.04/HR', resourceValue: 40, provider: 'aws' },
      },
      {
        id: 'n3', type: 'serviceNode',
        position: { x: 260, y: 300 },
        data: { label: 'Cache', type: 'service', status: 'Degraded', cost: '$0.02/HR', resourceValue: 20, provider: 'aws' },
      },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', animated: true },
      { id: 'e2', source: 'n1', target: 'n3', animated: false },
    ],
  },
}

const defaultGraph: GraphData = {
  nodes: [
    {
      id: 'n1', type: 'serviceNode',
      position: { x: 120, y: 100 },
      data: { label: 'Web Server', type: 'service', status: 'Healthy', cost: '$0.02/HR', resourceValue: 30, provider: 'aws' },
    },
    {
      id: 'n2', type: 'serviceNode',
      position: { x: 440, y: 100 },
      data: { label: 'Database', type: 'database', status: 'Healthy', cost: '$0.03/HR', resourceValue: 50, provider: 'aws' },
    },
    {
      id: 'n3', type: 'serviceNode',
      position: { x: 280, y: 300 },
      data: { label: 'Queue', type: 'service', status: 'Healthy', cost: '$0.01/HR', resourceValue: 15, provider: 'aws' },
    },
  ],
  edges: [
    { id: 'e1', source: 'n1', target: 'n2' },
    { id: 'e2', source: 'n1', target: 'n3' },
  ],
}

export const handlers = [
  http.get('/api/apps', async () => {
    await delay(400)
    return HttpResponse.json(apps)
  }),

  http.get('/api/apps/:appId/graph', async ({ params }) => {
    await delay(600)
    const { appId } = params
    const graph = graphs[appId as string] ?? defaultGraph
    return HttpResponse.json(graph)
  }),
]