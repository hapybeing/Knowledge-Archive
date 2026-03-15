import { create } from 'zustand'

interface UniverseState {
  activeNode: string | null
  viewState: 'macro' | 'transition' | 'micro'
  setActiveNode: (id: string | null) => void
  setViewState: (state: 'macro' | 'transition' | 'micro') => void
}

export const useStore = create<UniverseState>((set) => ({
  activeNode: null,
  viewState: 'macro',
  setActiveNode: (id) => set({ activeNode: id }),
  setViewState: (state) => set({ viewState: state }),
}))
