'use client';
import React from "react";
import Image from "next/image";
type MyComponentProps = {
    src: string;
    //id: number;
};
const Draggable: React.FC<MyComponentProps> = ( {src}) => {
    const handleDragStart = (event:React.DragEvent<HTMLImageElement>) => {
        event.dataTransfer?.setData('text/plain', src)
    }
    return(
        <Image 
        src={src}
        alt={'ageng icon'} 
        draggable={true}
        width={100}
        height={100}
        className="bg-slate-600 hover:bg-white rounded-lg border-2 border-blue-950" 
        onDragStart={handleDragStart}/>
    )
}

export default Draggable