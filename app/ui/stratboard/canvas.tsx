"use client"
import { useEffect, useRef } from 'react';
import {fabric} from 'fabric';
import { useAppStore } from '@/app/providers/app-store-provider';

const Canvas = () => {
    const {map, canvas, changeCanvas, isAttack, svgMaps, changeSVGMaps, currentMapObject, changeCurrentMapObject, draggableSrc, setDraggableSrc} = useAppStore((state)=>state,)
    // States for Canvas
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
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



                        


            // Prevent default behavior for dragover to allow drops
            const handleDragOver = (event: DragEvent) => {
              //console.log("default prevented")
              event.preventDefault();
              
          };

          // Handle drop event to create a new image instance on the canvas
          const handleDrop = (event: DragEvent) => {
              event.preventDefault();
      
              const imageUrl = event.dataTransfer?.getData('text/plain');
              
              if (imageUrl) {
                setDraggableSrc(imageUrl)
              //const rect = canvasRef.current!.getBoundingClientRect();
              //const x = event.clientX - rect.left;
              //const y = event.clientY - rect.top;
              
              
              }
          };
            // Attach event listeners to the canvas container
            const canvasContainer = canvasRef.current.parentNode as HTMLElement | null;
            if (canvasContainer){
                canvasContainer.addEventListener('dragover', handleDragOver as EventListener);
                canvasContainer.addEventListener('drop', handleDrop as EventListener);
            }
            //console.log(canvas)
            return () => {
                if (canvasContainer) {
                  canvasContainer.addEventListener('dragover', handleDragOver);
                  canvasContainer.addEventListener('drop', handleDrop);
                }
                fabricCanvas.dispose();
            };
        }
    }, [svgMaps]);

    useEffect(()=>{
      if (draggableSrc){
        fabric.Image.fromURL(draggableSrc, (img) => {
          img.scale(0.05)
          img.set({
          left: 0,
          top: 0,
          originX: 'center',
          originY: 'center',
          selectable: true,
          });
          canvas?.add(img);
          canvas?.renderAll();
          setDraggableSrc('')
      });
      }
       
    }, [canvas, draggableSrc])

    // Load and center SVG on the canvas
    useEffect(() => {
      if (canvas) {
        canvas.remove(...canvas.getObjects())
        if (svgMaps) {
            const mapObject = svgMaps[map]
            mapObject.selectable=false;
            canvas.add(mapObject)
            changeCurrentMapObject(mapObject)
            canvas?.renderAll();
        }
      }
    }, [canvas, map]);

    useEffect(()=>{
        if (currentMapObject) {
            currentMapObject.set('flipY', isAttack)
            canvas?.renderAll()
        }
    }, [isAttack])

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