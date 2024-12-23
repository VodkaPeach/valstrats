"use client"
import { useEffect, useRef, useState } from 'react';
import {fabric} from 'fabric';
import { useAppStore } from '@/app/providers/app-store-provider';
import { svgPaths } from '@/app/library/data';

const Canvas = () => {
    const {map, canvas, changeCanvas, isAttack, svgMaps, changeSVGMaps, 
      currentMapObject, changeCurrentMapObject, draggableSrc, setDraggableSrc,
      isDrawing, setIsDrawing, isErasingMode, isErasing, setIsErasing
    } = useAppStore((state)=>state)
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [iconDropPos, setIconDropPos] = useState({x: 0, y: 0})
    interface LoadedSVG {
        path: string;
        svg: fabric.Object;
      }

    useEffect(()=>{
      console.log("SVG LOAD useEffect")
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
        console.log("canvas useEffect ")
        if (canvasRef.current) {
            const fabricCanvas = new fabric.Canvas(canvasRef.current, {
                width:1100,
                height:600,
                fireMiddleClick: true,
                stopContextMenu: true, 
                selection: false,
                preserveObjectStacking: true,
                isDrawingMode:isDrawing,
            });

            changeCanvas(fabricCanvas);
    
            fabricCanvas.backgroundColor = 'lightgray';
            fabric.Object.prototype.selectable = false;


            fabricCanvas.renderAll();

            // Prevent default behavior for dragover to allow drops
            const handleDragOver = (event: DragEvent) => {
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
      console.log("set isDrawing useEffect")
      if(canvas){
        canvas.isDrawingMode=isDrawing
      }
    },[isDrawing])

    useEffect(()=>{
      console.log("drag drop icon useEffect")
      if (draggableSrc){
        fabric.Image.fromURL(draggableSrc, (img) => {
          img.scale(0.05)
          img.set({
          left: iconDropPos["x"],
          top: iconDropPos["y"],
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
       
    }, [draggableSrc])

    useEffect(()=>{
      console.log("clear canvas useEffect")
      if(canvas){
        canvas.remove(...canvas.getObjects())
      }
    },[map])

    // Load and center SVG on the canvas
    useEffect(() => {
      console.log("load map useEffect")
      if (canvas) {
        if (svgMaps) {
            const mapObject = svgMaps[map]
            mapObject.selectable=false;
            mapObject.flipY=isAttack
            changeCurrentMapObject(mapObject);
            canvas.add(mapObject)
            canvas.renderAll()
        }
      }
    }, [canvas,map,isAttack]);

    // zoom canvas and drop, dependency: canvas
    useEffect(()=>{
      if (canvas) {
        canvas.on('mouse:wheel', (opt) => {
          const delta = opt.e.deltaY;
          let zoom:number = canvas.getZoom();
          zoom*=0.999**delta;
          if(zoom>3) zoom=3;
          if(zoom<0.5) zoom=0.5;
          canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
          opt.e.preventDefault();
          opt.e.stopPropagation();
        });
        canvas.on('drop', (opt)=>{
          const pointer = canvas.getPointer(opt.e);
          setIconDropPos({x: pointer!.x, y:pointer!.y})
        })
      }
      return () => {
        canvas?.off("drop");
        canvas?.off('mouse:wheel')
      }
    }, [canvas])

    // mouse down/move/up effect, dependency: isDrawing, isErasing, currentMapObject
    useEffect(()=>{
      console.log("mouse move event useEffect")
        if(canvas){            
            canvas.on('mouse:move', function(this: any, opt) {
              if (this.isDragging) {
                var e = opt.e;
                var vpt = this.viewportTransform;
                vpt[4] += e.clientX - this.lastPosX;
                vpt[5] += e.clientY - this.lastPosY;
                this.renderAll();
                this.lastPosX = e.clientX;
                this.lastPosY = e.clientY;
              }
            });
        };
        return () => {
          canvas?.off('mouse:move')
        }
    }, [currentMapObject, isDrawing, isErasingMode])

  // mouse down useEffect, dependency: currentMapObject, isDrawing
  useEffect(()=>{
    if(canvas){
      canvas.on('mouse:down', function(this: any, opt){
        if(isErasingMode){
          setIsErasing(true)
          //console.log("mouse down start erasing")
        }
        var evt = opt.e;
        console.log("drawing mode: "+isDrawing+isErasingMode)
        if (!canvas.isDrawingMode && !isErasingMode){
          if (!opt.target || opt.target==currentMapObject) {
            console.log("triggered")
            this.isDragging = true;
            this.selection = false;
            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
          }
        }
      })
    }
    return () => {
      canvas?.off("mouse:down");
    }
  }, [isDrawing, currentMapObject, isErasingMode])

  useEffect(()=>{
    if(canvas){
      canvas.on('mouse:up', function(this: any, opt) {
        if(isErasing){
          setIsErasing(false)
          //console.log("mouse up stop erasing")
        }
        // on mouse up recalculate new interaction
        // for all objects, so we call setViewportTransform
        if(this.isDragging){
          this.setViewportTransform(this.viewportTransform);
          this.isDragging = false;
        }
        
      });
    }
    return () => {
      canvas?.off("mouse:up");
    }
  }, [canvas, isErasing])

    return (
        <div >
            <canvas ref={canvasRef} />
        </div>
    );
};

export default Canvas;