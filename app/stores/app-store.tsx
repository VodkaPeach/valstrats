// src/stores/map-store.tsx
import { createStore } from 'zustand/vanilla'

export type AppState = {
  map: string
  canvas: fabric.Canvas | null
  isAttack: boolean
  svgMaps: {[key: string]: fabric.Object} | null
  currentMapObject: fabric.Object | null
  draggableSrc: string | null
  isDrawing: boolean
  isErasing: boolean
  isErasingMode: boolean
}

export type AppActions = {
  changeMap: (newApp: string) => void
  changeCanvas: (newCanvas: fabric.Canvas) => void
  changeSide: () => void
  changeSVGMaps: (newSVGMaps: {[key: string]: fabric.Object}) => void
  changeCurrentMapObject: (newMapObject: fabric.Object) => void
  setDraggableSrc: (newSrc: string)=> void
  setIsDrawing: (newIsDrawing: boolean) => void
  setIsErasingMode: (newIsErasingMode: boolean) => void
  setIsErasing: (newIsErasing: boolean) => void
}

export type AppStore = AppState & AppActions

export const initAppStore = ():AppState=>{
  return {map: "Ascent", canvas: null, isAttack: true, svgMaps: null, 
    currentMapObject: null, draggableSrc: null, isDrawing:false,isErasing:false, isErasingMode:false,}
}

export const defaultInitState: AppState = {
  map: "Abyss",
  canvas: null,
  isAttack: true,
  svgMaps: null,
  currentMapObject: null,
  draggableSrc: null,
  isDrawing:false,
  isErasing:false,
  isErasingMode:false,
}

export const createAppStore = (
  initState: AppState = defaultInitState,
) => {
  return createStore<AppStore>()((set) => ({
    ...initState,
    changeMap: (newMap) => set(() => ({ map: newMap })),
    changeCanvas: (newCanvas) => set(()=>({canvas: newCanvas})),
    changeSide: () => set((state)=>({isAttack: !state.isAttack})),
    changeSVGMaps: (newSVGMaps) => set(()=>({svgMaps: newSVGMaps})),
    changeCurrentMapObject: (newMapObject) => set(()=>({currentMapObject: newMapObject})),
    setDraggableSrc: (newSrc)=>set(()=>({draggableSrc: newSrc})),
    setIsDrawing: (newIsDrawing) => set(()=> ({isDrawing: newIsDrawing})),
    setIsErasing: (newIsErasing) => set(()=> ({isErasing: newIsErasing})),
    setIsErasingMode: (newIsErasingMode) => set(()=> ({isErasingMode: newIsErasingMode})),
  }))
}
