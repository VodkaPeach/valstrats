"use client"
import { useEffect, useRef, useState } from 'react';
import {fabric} from 'fabric';

const Canvas = () => {
    // States for Canvas
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const fabricCanvas = new fabric.Canvas(canvasRef.current, {
                width:1100,
                height:600,
                fireMiddleClick: true,
                stopContextMenu: true, 
                selection: true,
                preserveObjectStacking: true
            });
            //fabricCanvas.setDimensions({width:"100%", height:"100%"}, {cssOnly:true})
    
            setCanvas(fabricCanvas);
    
            fabricCanvas.backgroundColor = 'lightgray';
            fabricCanvas.renderAll();

            return () => {
                fabricCanvas.dispose();
            };
        }
    }, []);

    // Load and center SVG on the canvas
    useEffect(() => {
      if (canvas) {
          fabric.loadSVGFromURL('/minimap/Abyss_minimap.svg', (objects, options) => {
              const svg = fabric.util.groupSVGElements(objects, options);
              // Add the SVG to the canvas and render
              canvas?.add(svg);
              canvas?.renderAll();
          });
      }
    }, [canvas]);

    return (
        <div >
            <canvas ref={canvasRef} />
        </div>
    );
};

export default Canvas;