import { create } from 'zustand'

interface AppStore {
  selectedAppId: string
  selectedNodeId: string | null
  isMobilePanelOpen: boolean
  activeInspectorTab: string
  addNode: (() => void) | null

  setSelectedAppId: (id: string) => void
  setSelectedNodeId: (id: string | null) => void
  setMobilePanelOpen: (open: boolean) => void
  toggleMobilePanel: () => void
  setActiveInspectorTab: (tab: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  selectedAppId: 'app-1',
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: 'config',
  addNode: null,

  setSelectedAppId: (id) => set({ selectedAppId: id, selectedNodeId: null }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setMobilePanelOpen: (open) => set({ isMobilePanelOpen: open }),
  toggleMobilePanel: () => set((s) => ({ isMobilePanelOpen: !s.isMobilePanelOpen })),
  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
}))