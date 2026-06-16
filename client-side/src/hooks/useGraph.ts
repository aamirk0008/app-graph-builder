import { useQuery } from '@tanstack/react-query'
import type { GraphData } from '@/types'

async function fetchGraph(appId: string): Promise<GraphData> {
  const res = await fetch(`/api/apps/${appId}/graph`)
  if (!res.ok) throw new Error('Failed to fetch graph')
  return res.json() as Promise<GraphData>
}

export function useGraph(appId: string) {
  return useQuery<GraphData, Error>({
    queryKey: ['graph', appId],
    queryFn: () => fetchGraph(appId),
    enabled: Boolean(appId),
    staleTime: 2 * 60 * 1000,
  })
}