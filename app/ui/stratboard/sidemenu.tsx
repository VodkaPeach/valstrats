'use client'
import MapMenu from "./dropdown"
import { useAppStore } from "@/app/providers/app-store-provider"
export default function SideMenu(){
    const {changeSide, isDrawing, setIsDrawing, isErasing, setIsErasing} = useAppStore(state=>state)
    const handleChangeSide = () => {
        changeSide()
    }
    const handleIsDrawingSwitch = () => {
        setIsDrawing(!isDrawing)
        setIsErasing(false)
    }
    const handleIsErasingSwitch = () => {
        setIsDrawing(false)
        setIsErasing(!isErasing)
    }
    return(
        <div className="flex flex-col">
            <div className="flex flex-row">
                <MapMenu/>
                <button onClick={handleChangeSide}>A</button>
            </div>
            <div>
                <button>Delete Everything</button>
            </div>
            <div>Tools</div>
            <div className="grid grid-cols-4">
                <button onClick={handleIsDrawingSwitch}>Pen</button>
                <button onClick={handleIsErasingSwitch}>Eraser</button>
            </div>
        </div>
    )
}