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
              }
          };
            // Attach event listeners to the canvas container
            const canvasContainer = canvasRef.current.parentNode as HTMLElement | null;
            if (canvasContainer){
                canvasContainer.addEventListener('dragover', handleDragOver as EventListener);
                canvasContainer.addEventListener('drop', handleDrop as EventListener);
            }
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
          backgroundColor: ""
          });
          img.lockScalingX=true
          img.lockScalingY=true
          img.lockRotation=true
          img.hasControls=false
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
            mapObject.flipY=isAttack
            changeCurrentMapObject(mapObject);
            canvas.add(mapObject)
            canvas?.renderAll();
        }
      }
    }, [canvas, map]);

    useEffect(()=>{
        if (currentMapObject) {
            currentMapObject.set('flipY', isAttack)
            canvas?.renderAll()
        }
    }, [canvas, isAttack])

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
            canvas.on('mouse:down', function(this: any, opt){
              var evt = opt.e;
              
              if (!opt.target || opt.target==currentMapObject) {
                this.isDragging = true;
                this.selection = false;
                this.lastPosX = evt.clientX;
                this.lastPosY = evt.clientY;
              }
            });
            canvas.on('mouse:move', function(this: any, opt) {
              if (this.isDragging) {
                var e = opt.e;
                var vpt = this.viewportTransform;
                vpt[4] += e.clientX - this.lastPosX;
                vpt[5] += e.clientY - this.lastPosY;
                this.requestRenderAll();
                this.lastPosX = e.clientX;
                this.lastPosY = e.clientY;
              }
            });
            canvas.on('mouse:up', function(this: any, opt) {
              // on mouse up we want to recalculate new interaction
              // for all objects, so we call setViewportTransform
              this.setViewportTransform(this.viewportTransform);
              this.isDragging = false;
              this.selection = true;
            });
        };
        
    }, [canvas,currentMapObject])

    return (
        <div >
            <canvas ref={canvasRef} />
        </div>
    );
};

export default Canvas;