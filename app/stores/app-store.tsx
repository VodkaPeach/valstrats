// src/stores/map-store.tsx
import { createStore } from 'zustand/vanilla'

export type AppState = {
  map: string
  canvas: fabric.Canvas | null
}

export type AppActions = {
  changeMap: (newApp: string) => void
  changeCanvas: (newCanvas: fabric.Canvas) => void
}

export type AppStore = AppState & AppActions

export const initAppStore = ():AppState=>{
  return {map: "Ascent", canvas: null}
}

export const defaultInitState: AppState = {
  map: "Abyss",
  canvas: null
}

export const createAppStore = (
  initState: AppState = defaultInitState,
) => {
  return createStore<AppStore>()((set) => ({
    ...initState,
    changeMap: (newApp) => set(() => ({ map: newApp })),
    changeCanvas: (newCanvas) => set(()=>({canvas: newCanvas}))
  }))
}