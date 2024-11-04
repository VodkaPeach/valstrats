"use client"
import { useEffect, useRef } from 'react';
import {fabric} from 'fabric';
import { useAppStore } from '@/app/providers/app-store-provider';

const Canvas = () => {
    const {map, canvas, changeCanvas, isAttack, svgMaps, changeSVGMaps} = useAppStore((state)=>state,)
    // States for Canvas
    const canvasRef = useRef(null);
    // const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

    interface LoadedSVG {
        path: string;
        svg: fabric.Object;
      }

    useEffect(()=>{
        const svgPaths = [
            'Abyss',
            'Ascent',
            'Bind',
            'Breeze',
            'Fracture',
            'Haven',
            'Icebox',
            'Lotus',
            'Pearl',
            'Split',
            'Sunset',
        ];
        Promise.all<LoadedSVG>(
            svgPaths.map((path: string) =>
              new Promise((resolve, reject) => {
                fabric.loadSVGFromURL(`/minimap/${path}.svg`, (objects, options) => {
                  if (objects) {
                    resolve({ path, svg: fabric.util.groupSVGElements(objects, options) });
                  } else {
                    reject(`Failed to load ${path}`);
                  }
                });
              })
            )
          ).then((svgData) => {
            const svgMapGroups: Record<string, fabric.Object> = {};
            svgData.forEach(({ path, svg }) => {
              svgMapGroups[path] = svg;
            });
            changeSVGMaps(svgMapGroups);
          }).catch((error) => console.error(error));
    }, [])

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
    }, [svgMaps]);

    // Load and center SVG on the canvas
    useEffect(() => {
      if (canvas) {
        canvas.remove(...canvas.getObjects())
        if (svgMaps) {
            canvas.add(svgMaps[map])
            canvas?.renderAll();
        }
      }
    }, [canvas, map]);

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