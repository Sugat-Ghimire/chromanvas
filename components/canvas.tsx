"use client";
import React, { useRef, useEffect, useState } from "react";
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
import { Copy, Paste } from "@/lib/canvas/copyPaste";
import useImageUploader from "@/hooks/useImageUpload";
import { Switch } from "./ui/switch";

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
  const [gridEnabled, setGridEnabled] = useState(false);
  const { handleFileChange } = useImageUploader();

  useEffect(() => {
    const canvasInstance = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#FFFFFF",
    });

    setCanvas(canvasInstance);

    //functionality for showing and removing text over the canvas.
    const canvasLeft =
      document.querySelector("body")?.getBoundingClientRect()?.width! / 2;
    const canvasTop =
      document.querySelector("body")?.getBoundingClientRect()?.height! / 2;

    const instructionText = new fabric.IText(
      "Click and drag to draw on the canvas",
      {
        left: canvasLeft,
        top: canvasTop,
        fontSize: 20,
        fontFamily: "sans-serif",
        textAlign: "center",
        originX: "center",
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
  //
  //trying to add guide lines
  let horizontalGuide, verticalGuide;

  const addGuideLine = (type, position) => {
    if (type === "horizontal" && !horizontalGuide) {
      horizontalGuide = new fabric.Line([0, position, canvas.width, position], {
        stroke: "blue",
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      canvas.add(horizontalGuide);
    } else if (type === "vertical" && !verticalGuide) {
      verticalGuide = new fabric.Line([position, 0, position, canvas.height], {
        stroke: "blue",
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      canvas.add(verticalGuide);
    }
  };

  const removeGuideLine = (type) => {
    if (type === "horizontal" && horizontalGuide) {
      canvas.remove(horizontalGuide);
      horizontalGuide = null;
    } else if (type === "vertical" && verticalGuide) {
      canvas.remove(verticalGuide);
      verticalGuide = null;
    }
  };

  // Listen to object movement
  canvas?.on("object:moving", (e) => {
    const obj = e.target;

    // Canvas center points
    const centerX =
      document.querySelector("body")?.getBoundingClientRect()?.width! / 2;
    const centerY =
      document.querySelector("body")?.getBoundingClientRect()?.height! / 2;

    // Check alignment with canvas center
    if (Math.abs(obj.left + obj.width / 2 - centerX) < 5) {
      addGuideLine("vertical", centerX);
    } else {
      removeGuideLine("vertical");
    }

    if (Math.abs(obj.top + obj.height / 2 - centerY) < 5) {
      addGuideLine("horizontal", centerY);
    } else {
      removeGuideLine("horizontal");
    }
  });

  // Remove guide lines on mouse up
  canvas?.on("mouse:up", () => {
    removeGuideLine("horizontal");
    removeGuideLine("vertical");
  });
  //
  canvas?.on("mouse:dblclick", () => {
    if (canvas?.getActiveObject()?.type == "textbox") {
      setDrawingMode("text");
      return;
    } else {
      setDrawingMode(canvas?.getActiveObject()?.type);
    }
  });
  //
  const drawGrid = () => {
    if (!canvas) return;

    const gridSize = 40; // Size of each grid square

    // Remove previous grid group if it exists
    const existingGridGroup = canvas
      .getObjects()
      .find((obj) => obj.isGridGroup);
    if (existingGridGroup) {
      canvas.remove(existingGridGroup);
    }

    // Get zoom and viewport transformation
    const zoom = canvas.getZoom();
    const viewportTransform = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];

    // Calculates visible area
    const visibleWidth = canvas.getWidth() / zoom;
    const visibleHeight = canvas.getHeight() / zoom;
    const offsetX = -viewportTransform[4] / zoom;
    const offsetY = -viewportTransform[5] / zoom;

    // Calculates start and end points for the grid
    const startX = Math.floor(offsetX / gridSize) * gridSize;
    const startY = Math.floor(offsetY / gridSize) * gridSize;
    const endX = offsetX + visibleWidth;
    const endY = offsetY + visibleHeight;

    // Creates a new group for the grid lines
    const gridGroup = new fabric.Group([], {
      selectable: false,
      evented: false,
      isGridGroup: true,
    });

    // Draws vertical grid lines
    for (let x = startX; x <= endX; x += gridSize) {
      const line = new fabric.Line([x, startY, x, endY], {
        stroke: "#d0d0d0",
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        isGridLine: true, // Custom property to identify grid lines
      });
      gridGroup.addWithUpdate(line);
    }

    // Draw horizontal grid lines
    for (let y = startY; y <= endY; y += gridSize) {
      const line = new fabric.Line([startX, y, endX, y], {
        stroke: "#d0d0d0",
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        isGridLine: true,
      });
      gridGroup.addWithUpdate(line);
    }

    // Adds the grid group to the canvas and send it to the back
    canvas.add(gridGroup);
    canvas.sendToBack(gridGroup);
    canvas.requestRenderAll();
  };

  // Utility function to debounce a given function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced version of drawGrid
  const debouncedDrawGrid = debounce(drawGrid, 100);

  // Removes grid lines only (without affecting other objects)
  const removeGrid = () => {
    if (!canvas) return;

    const existingGridGroup = canvas
      .getObjects()
      .find((obj) => obj.isGridGroup);
    if (existingGridGroup) {
      canvas.remove(existingGridGroup);
    }
    canvas.requestRenderAll();
  };

  // Handle toggle to enable/disable the grid
  const handleToggle = (checked: boolean) => {
    setGridEnabled(checked); // Update state for grid toggle
    if (checked) {
      drawGrid(); // Draw grid when enabled
      //event listeners for dynamic updates
      canvas?.on("mouse:wheel", debouncedDrawGrid);
      canvas?.on("mouse:down", () => {
        canvas.on("mouse:move", debouncedDrawGrid);
      });
      canvas?.on("mouse:up", () => {
        canvas.off("mouse:move", debouncedDrawGrid);
      });
    } else {
      removeGrid(); // Remove grid when disabled
      canvas?.off("mouse:wheel", debouncedDrawGrid);
      canvas?.off("mouse:down");
      canvas?.off("mouse:up");
    }
  };

  // Initial grid draw based on toggle state
  if (gridEnabled) {
    drawGrid();
  }

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

  //copy paste and ctrl + o image uploader
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === "o") {
          // Ctrl + O: Open image uploader
          event.preventDefault();
          fileInputRef.current?.click();
        } else if (event.ctrlKey && event.key === "c") {
          // Ctrl + C: Copy
          if (canvas) Copy(canvas);
          event.preventDefault();
        } else if (event.ctrlKey && event.key === "v") {
          // Ctrl + V: Paste
          if (canvas) Paste(canvas);
          event.preventDefault();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [canvas]);

  //
  return (
    <div className="flex-col relative h-screen w-screen">
      {/* Header */}
      <div className="relative z-30">
        <Header fileInputRef={fileInputRef} />
      </div>

      {/* Main Content */}
      <div className="relative h-full w-full">
        {/* Sidebar */}
        <div className="absolute top-15 left-5 z-20 w-56">
          <SideBar />
        </div>

        {/* Zoom Element */}
        <div className="absolute bottom-20 left-7 z-30 mb-2">
          <ZoomElement />
        </div>

        {/* Side Sheet */}
        <div className="absolute bottom-2 right-1 z-30 mr-8 -mb-1">
          <SideSheet />
        </div>

        {/* Switch for grid lines */}
        <div className="absolute bottom-3.5 right-24 z-20 flex items-center space-x-2 ">
          <label htmlFor="canvasToggle" className="text-base text-gray-800">
            Grid Lines
          </label>
          <Switch
            id="canvasToggle"
            checked={gridEnabled}
            onCheckedChange={handleToggle}
          />
        </div>

        {/* Canvas */}
        <div className="relative z-10 h-full w-full">
          <div ref={canvasWrapperRef} className="h-full w-full">
            <canvas
              ref={canvasRef}
              className="z-0 block h-full w-full"
              width={1920}
              height={727}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasPage;
