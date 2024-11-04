'use client'
import MapMenu from "./dropdown"
import { useAppStore } from "@/app/providers/app-store-provider"
export default function SideMenu(){
    const {changeSide} = useAppStore(state=>state)
    const handleChangeSide = () => {
        changeSide()
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
                <button>Pen</button>
                <button>Eraser</button>
            </div>
        </div>
    )
}