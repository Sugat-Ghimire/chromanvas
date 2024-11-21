"use client";
import React, { useRef, useEffect } from "react";
import SideBar from "@/components/canvas/sidebar";
import { fabric } from "fabric";
import ZoomElement from "./canvas/zoomElement";
import useZoomStore from "@/store/useZoomStore";
import Dropdown from "./canvas/dropdown";
import { useCanvasStore, useDrawingModeStore } from "@/store/useCanvasStore";
import Header from "./canvas/header";
import { drawRectangle } from "@/lib/canvas/rectangle";
import { drawCircle } from "@/lib/canvas/circle";
import { drawLine } from "@/lib/canvas/line";

import { drawText } from "@/lib/canvas/text";
import { drawTriangle } from "@/lib/canvas/triangle";
import SideSheet from "./canvas/sideSheet";
//the main canvas page
const CanvasPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const canvas = useCanvasStore((state) => state.canvas);
  const setCanvas = useCanvasStore((state) => state.setCanvas);

  const drawingMode = useDrawingModeStore((state) => state.drawingMode);
  const prevMode = useDrawingModeStore((state) => state.prevMode);
  const setDrawingMode = useDrawingModeStore((state) => state.setDrawingMode);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const zoom = useZoomStore((state) => state.zoom);

  const incrementZoom = useZoomStore((state) => state.incrementZoom);
  const decrementZoom = useZoomStore((state) => state.decrementZoom);

  useEffect(() => {
    const canvasInstance = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#FBFBFC",
    });

    setCanvas(canvasInstance);
    //functionality for showing and removing text over the canvas.
    const instructionText = new fabric.IText(
      "Click and drag to draw on the canvas",
      {
        left: canvasInstance.width! / 2,
        top: canvasInstance.height! / 2,
        fontSize: 20,
        fontFamily: "sans-serif",
        textAlign: "center",
        originX: "right",
        originY: "center",
        fill: "rgba(1, 0, 0, 0.8)",
        selectable: false,
        evented: false,
      }
    );
    instructionText.set({
      objectCaching: false,
    });
    canvasInstance.add(instructionText);

    function removeText() {
      canvasInstance?.remove(instructionText);
    }
    canvasInstance?.on("mouse:down", removeText);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && canvasInstance.getActiveObject()) {
        canvasInstance.remove(canvasInstance.getActiveObject());
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        zoomFactor > 0.9 ? incrementZoom() : decrementZoom();
      }
    };
    canvasWrapperRef.current?.addEventListener("wheel", handleWheel);

    return () => {
      canvasInstance.dispose();
      window.removeEventListener("keydown", handleKeyDown);
      canvasWrapperRef.current?.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    if (canvas) {
      canvas.setZoom(zoom);
      canvas.renderAll();
    }
  }, [zoom, canvas]);
  let isMouseDown = false;

  const handleMouseDown = (event) => {
    while (!canvas.getActiveObject()) {
      if (
        !drawingMode ||
        drawingMode === "image" ||
        drawingMode === "pencil" ||
        drawingMode === "activeSelection" ||
        !canvas
      )
        return;
      isMouseDown = true;
      const pointer = canvas.getPointer(event.e);
      let shape = null;

      switch (drawingMode) {
        case "rect":
          shape = drawRectangle(canvas, pointer);
          break;
        case "circle":
          shape = drawCircle(canvas, pointer);
          break;
        case "triangle":
          shape = drawTriangle(canvas, pointer);
          break;
        case "line":
          shape = drawLine(canvas, pointer);
          break;
        case "text":
          shape = drawText(canvas, pointer);
          break;
        default:
          break;
      }

      if (shape) {
        canvas.add(shape);
        canvas.setActiveObject(shape);
      }
    }
  };

  const handleMouseMove = (event) => {
    if (
      !isMouseDown ||
      !drawingMode ||
      drawingMode === "image" ||
      drawingMode === "pencil" ||
      drawingMode === "activeSelection" ||
      !canvas
    )
      return;

    const shape = canvas.getActiveObject();
    if (!shape) return;

    const pointer = canvas.getPointer(event.e);
    const origin = { left: shape.left!, top: shape.top! };
    switch (drawingMode) {
      case "rect":
      case "triangle":
        shape.set({
          width: Math.abs(pointer.x - origin.left),
          height: Math.abs(pointer.y - origin.top),
        });
        break;
      case "circle":
        const radius = Math.sqrt(
          Math.pow(pointer.x - origin.left, 2) +
            Math.pow(pointer.y - origin.top, 2)
        );
        shape.set({ radius });
        break;
      case "line":
        const line = shape;
        line.set({ x2: pointer.x, y2: pointer.y });
        break;
      case "text":
        shape.set({
          width: Math.abs(pointer.x - origin.left),
          height: Math.abs(pointer.y - origin.top),
        });
        break;
      default:
        break;
    }

    shape.setCoords();
    canvas.renderAll();
  };

  const handleMouseUp = () => {
    isMouseDown = false;
    if (drawingMode == "pencil" || canvas?.getActiveObject()?.type == "path") {
      setDrawingMode("pencil");
      return;
    }
    if (canvas?.getActiveObject()?.type == "path") {
      setDrawingMode("image");
    } else {
      setDrawingMode(null);
    }
  };

  canvas?.on("mouse:dblclick", () => {
    if (canvas?.getActiveObject()?.type == "textbox") {
      setDrawingMode("text");
      return;
    } else {
      setDrawingMode(canvas?.getActiveObject()?.type);
    }
  });

  useEffect(() => {
    if (canvas) {
      canvas.on("mouse:down", handleMouseDown);
      canvas.on("mouse:move", handleMouseMove);
      canvas.on("mouse:up", handleMouseUp);
    }

    return () => {
      if (canvas) {
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:move", handleMouseMove);
        canvas.off("mouse:up", handleMouseUp);
      }
    };
  }, [canvas, drawingMode]);
  console.log(canvas?.getActiveObject()?.type);

  return (
    <div className="flex-col relative">
      <div className="relative z-30 mx-6">
        <Header fileInputRef={fileInputRef} />
      </div>

      <div className="relative">
        <div className="absolute top-15 left-5 z-20 w-56">
          <SideBar />
        </div>

        <div className="absolute bottom-20 left-7 z-30 mb-2">
          <ZoomElement />
        </div>
        <div className="absolute bottom-2 right-1 z-30 mr-8 mb-2">
          {/* <Dropdown /> */}
          <SideSheet />
        </div>

        <div className="relative z-10">
          <div ref={canvasWrapperRef}>
            <canvas className="z-0" ref={canvasRef} width={1920} height={727} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasPage;
