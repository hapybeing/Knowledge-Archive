import { create } from 'zustand'

interface UniverseState {
  activeNode: string | null
  viewState: 'macro' | 'transition' | 'micro'
  scrollProgress: number
  setActiveNode: (id: string | null) => void
  setViewState: (state: 'macro' | 'transition' | 'micro') => void
  setScrollProgress: (progress: number) => void
}

export const useStore = create<UniverseState>((set) => ({
  activeNode: null,
  viewState: 'macro',
  scrollProgress: 0,
  setActiveNode: (id) => set({ activeNode: id }),
  setViewState: (state) => set({ viewState: state }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
}))
