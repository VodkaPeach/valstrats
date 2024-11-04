'use client'
import MapMenu from "./dropdown"
export default function SideMenu(){
    return(
        <div className="flex flex-col">
            <div className="flex flex-row">
                <MapMenu/>
                <button>A</button>
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