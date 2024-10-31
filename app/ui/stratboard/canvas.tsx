"use client";
import * as fabric from "fabric";
import React, { useState, useEffect } from "react";


const Canvas = () => {
    const [canvas, setCanvas] = useState<fabric.Canvas>();
  
    useEffect(() => {
        const c = new fabric.Canvas("canvas", {
          backgroundColor: "black",
        });
        c.setDimensions({width: '100%', height: "100%"}, {cssOnly: true})
    
        // settings for all canvas in the app
        fabric.FabricObject.prototype.transparentCorners = false;
        fabric.FabricObject.prototype.cornerColor = "#2BEBC8";
        fabric.FabricObject.prototype.cornerStyle = "rect";
        fabric.FabricObject.prototype.cornerStrokeColor = "#2BEBC8";
        fabric.FabricObject.prototype.cornerSize = 6;
    
        setCanvas(c);
        c.requestRenderAll();
        return () => {
          c.dispose();
        };
      }, []);
    return (
        <div>
          <canvas id="canvas" />
        </div>
      );
    };
  
  export default Canvas;