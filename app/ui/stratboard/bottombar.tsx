"use client"
import { useRef, useEffect } from "react";
import Draggable from "./draggable";

export default function BottomBar(){
    const scrollContainerRef = useRef<HTMLDivElement>(null); // Reference to the scrollable container

    useEffect(() => {
      // Function to handle the wheel event
      const handleWheel = (event: { preventDefault: () => void; deltaY: any;}) => {
        // Prevent vertical scroll by calling preventDefault
        event.preventDefault();
        // Check if the container exists, then scroll horizontally based on wheel delta
        if (scrollContainerRef.current!) {
          scrollContainerRef.current!.scrollLeft += event.deltaY;
        }
      };
  
      // Add event listener to the container element
      const container: any = scrollContainerRef.current;
      container!.addEventListener('wheel', handleWheel, { passive: false });
  
      // Cleanup function to remove the event listener when component unmounts
      return () => {
        container!.removeEventListener('wheel', handleWheel);
      };
    }, []);
    const agentIconPaths: string[] = [
        "/agent/Astra_icon.webp",
        "/agent/Breach_icon.webp",
        "/agent/Brimstone_icon.webp",
        "/agent/Chamber_icon.webp",
        "/agent/Clove_icon.webp",
        "/agent/Cypher_icon.webp",
        "/agent/Deadlock_icon.webp",
        "/agent/Fade_icon.webp",
        "/agent/Gekko_icon.webp",
        "/agent/Harbor_icon.webp",
        "/agent/Iso_icon.webp",
        "/agent/Jett_icon.webp",
        "/agent/KAYO_icon.webp",
        "/agent/Killjoy_icon.webp",
        "/agent/Neon_icon.webp",
        "/agent/Omen_icon.webp",
        "/agent/Phoenix_icon.webp",
        "/agent/Raze_icon.webp",
        "/agent/Reyna_icon.webp",
        "/agent/Sage_icon.webp",
        "/agent/Skye_icon.webp",
        "/agent/Sova_icon.webp",
        "/agent/Viper_icon.webp",
        "/agent/Vyse_icon.webp",
        "/agent/Yoru_icon.webp",
    ]
    const agentIconArray = agentIconPaths.map(
        (path, index) => (
          <Draggable src={path} key={index}/>
        )
    )
    return(
        <div ref={scrollContainerRef} className="flex flow-row overflow-auto">  
          <div>Ally</div>
          <div className="flex my-0.5">{agentIconArray}</div>
        </div>
    )
}