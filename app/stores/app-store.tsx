// src/stores/map-store.tsx
import { createStore } from 'zustand/vanilla'

export type AppState = {
  map: string
  canvas: fabric.Canvas | null
  isAttack: boolean
  svgMaps: {[key: string]: fabric.Object} | null
}

export type AppActions = {
  changeMap: (newApp: string) => void
  changeCanvas: (newCanvas: fabric.Canvas) => void
  changeSide: () => void
  changeSVGMaps: (newSVGMaps: {[key: string]: fabric.Object}) => void
}

export type AppStore = AppState & AppActions

export const initAppStore = ():AppState=>{
  return {map: "Ascent", canvas: null, isAttack: true, svgMaps: null,}
}

export const defaultInitState: AppState = {
  map: "Abyss",
  canvas: null,
  isAttack: true,
  svgMaps: null,
}

export const createAppStore = (
  initState: AppState = defaultInitState,
) => {
  return createStore<AppStore>()((set) => ({
    ...initState,
    changeMap: (newMap) => set(() => ({ map: newMap })),
    changeCanvas: (newCanvas) => set(()=>({canvas: newCanvas})),
    changeSide: () => set((state)=>({isAttack: !state.isAttack})),
    changeSVGMaps: (newSVGMaps) => set(()=>({svgMaps: newSVGMaps}))
  }))
}