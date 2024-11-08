'use client'
import MapMenu from "./dropdown"
import { useAppStore } from "@/app/providers/app-store-provider"
export default function SideMenu(){
    const {changeSide, isDrawing, setIsDrawing, isErasingMode, setIsErasingMode} = useAppStore(state=>state)
    const handleChangeSide = () => {
        changeSide()
    }
    const handleIsDrawingSwitch = () => {
        setIsDrawing(!isDrawing)
        setIsErasingMode(false)
    }
    const handleIsErasingModeSwitch = () => {
        setIsDrawing(false)
        setIsErasingMode(!isErasingMode)
    }
    return(
        <div className="flex flex-col">
            <div className="inline-block space-x-0.5">
                <MapMenu/>
                <button className="w-1/4 rounded-md bg-slate-500" onClick={handleChangeSide}>A</button>
            </div>
            <div>
                <button>Delete Everything</button>
            </div>
            <div>Tools</div>
            <div className="grid grid-cols-4">
                <button onClick={handleIsDrawingSwitch}>Pen</button>
                <button onClick={handleIsErasingModeSwitch}>Eraser</button>
            </div>
        </div>
    )
}