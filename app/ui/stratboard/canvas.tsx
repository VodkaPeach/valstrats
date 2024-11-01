"use client"
import { useEffect, useRef } from 'react';
import {fabric} from 'fabric';
import { useAppStore } from '@/app/providers/app-store-provider';

const Canvas = () => {
    const {map, canvas, changeCanvas} = useAppStore((state)=>state,)
    // States for Canvas
    const canvasRef = useRef(null);
    // const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

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
    
            changeCanvas(fabricCanvas);
    
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
          fabric.loadSVGFromURL(`/minimap/${map}.svg`, (objects, options) => {
              const svg = fabric.util.groupSVGElements(objects, options);
              // Add the SVG to the canvas and render
              canvas?.add(svg);
              canvas?.renderAll();
          });
      }
    }, [canvas]);

    useEffect(()=>{
        if(canvas){
            canvas.on('mouse:wheel', (opt) => {
                const delta = opt.e.deltaY;
                let zoom:number = canvas.getZoom();
                zoom*=0.999**delta;
                if(zoom>3) zoom=3;
                if(zoom<0.5) zoom=0.5;
                canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
                opt.e.preventDefault();
                opt.e.stopPropagation();
            })
        };
        
    }, [canvas])

    return (
        <div >
            <canvas ref={canvasRef} />
        </div>
    );
};

export default Canvas;