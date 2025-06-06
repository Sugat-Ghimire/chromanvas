"use client";
import React, { useRef, useEffect, useState, useCallback, use } from "react";
import SideBar from "@/components/canvas/sidebar";
import { fabric } from "fabric";
import type { IGroupOptions } from "fabric/fabric-impl";
import ZoomElement from "./canvas/zoomElement";
import useZoomStore from "@/store/useZoomStore";

declare module "fabric/fabric-impl" {
  interface IGroupOptions {
    isGridGroup?: boolean;
  }
  interface ILineOptions {
    isGridLine?: boolean;
  }
}
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
import { debounce } from "@/lib/debounce";
import UndoRedo from "./canvas/undoRedo";
import useCanvasHistory from "@/hooks/useCanvasHistory";

const CanvasPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const canvas = useCanvasStore((state: any) => state.canvas);
  const setCanvas = useCanvasStore((state: any) => state.setCanvas);

  const drawingMode = useDrawingModeStore((state: any) => state.drawingMode);
  const prevMode = useDrawingModeStore((state: any) => state.prevMode);
  const setDrawingMode = useDrawingModeStore(
    (state: any) => state.setDrawingMode
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const zoom = useZoomStore((state: any) => state.zoom);

  const incrementZoom = useZoomStore((state: any) => state.incrementZoom);
  const decrementZoom = useZoomStore((state: any) => state.decrementZoom);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [currentTool, setCurrentTool] = useState("select"); //for selection box

  const { handleFileChange } = useImageUploader();
  const { saveState } = useCanvasHistory(canvas);
  // Updates the initial useEffect for canvas initialization

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create canvas instance with dimensions from the wrapper
    const canvasInstance = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#FFFFFF",
      preserveObjectStacking: true,
      width: canvasRef.current.width,
      height: canvasRef.current.height,
      selection: true,
    });

    // Set canvas instance in store
    setCanvas(canvasInstance);

    // Making sure canvas is ready before any operations
    if (canvasInstance.getContext()) {
      // Adds instruction text
      const canvasCenter = {
        x: canvasInstance.width! / 2,
        y: canvasInstance.height! / 2,
      };

      const instructionText = new fabric.IText(
        "Click and drag to draw on the canvas",
        {
          left: canvasCenter.x,
          top: canvasCenter.y,
          fontSize: 20,
          fontFamily: "sans-serif",
          textAlign: "center",
          originX: "right",
          originY: "center",
          fill: "rgba(1, 0, 0, 0.8)",
          selectable: false,
          evented: false,
          objectCaching: false,
        }
      );

      canvasInstance.add(instructionText);
      canvasInstance.renderAll();

      // Remove text on first interaction
      const removeText = () => {
        canvasInstance.remove(instructionText);
        canvasInstance.off("mouse:down", removeText);
        canvasInstance.renderAll();
      };

      canvasInstance.on("mouse:down", removeText);
    }

    // Handle window resize
    const handleResize = () => {
      if (canvasWrapperRef.current) {
        canvasInstance.setDimensions({
          width: canvasWrapperRef.current.clientWidth,
          height: canvasWrapperRef.current.clientHeight,
        });
        canvasInstance.renderAll();
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      canvasInstance.dispose();
    };
  }, []);
  useEffect(() => {
    if (canvas) {
      canvas.setZoom(zoom);
      canvas.renderAll();
    }
  }, [zoom, canvas]);
  let isMouseDown = false;

  const handleMouseDown = (event: fabric.IEvent) => {
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
      if (drawingMode === "circle") {
        const pointer = canvas.getPointer(event.e);
        const circle = drawCircle(canvas, pointer) as fabric.Object & {
          initialPoint?: { x: number; y: number };
        };
        circle.initialPoint = { x: pointer.x, y: pointer.y };
      }
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

  const handleMouseMove = (event: fabric.IEvent) => {
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
      case "circle": {
        if (!shape.initialPoint) {
          shape.initialPoint = {
            x: shape.left, // Stores top-left point
            y: shape.top,
          };
        }

        // Calculates radius from top-left to cursor
        const deltaX = pointer.x - shape.initialPoint.x;
        const deltaY = pointer.y - shape.initialPoint.y;
        const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 2;

        // Applies constraints
        const maxRadius = Math.min(canvas.width!, canvas.height!) / 3;
        const constrainedRadius = Math.min(Math.max(radius, 1), maxRadius);

        // Updates circle position keeping cursor at bottom-right edge
        shape.set({
          radius: constrainedRadius,
          left: pointer.x - constrainedRadius * 2, // Position circle relative to cursor
          top: pointer.y - constrainedRadius * 2,
        });
        break;
      }
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
  let horizontalGuide: fabric.Line | null = null;
  let verticalGuide: fabric.Line | null = null;

  const addGuideLine = (type: string, position: number) => {
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

  const removeGuideLine = (type: string) => {
    if (type === "horizontal" && horizontalGuide) {
      canvas.remove(horizontalGuide);
      horizontalGuide = null;
    } else if (type === "vertical" && verticalGuide) {
      canvas.remove(verticalGuide);
      verticalGuide = null;
    }
  };

  // Listen to object movement
  canvas?.on("object:moving", (e: any) => {
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
    // Only draw grid if grid is explicitly enabled
    if (!canvas || !gridEnabled) return;

    const gridSize = 40;

    // Remove previous grid group if it exists
    const existingGridGroup = canvas
      .getObjects()
      .find((obj: fabric.Object | any) => obj.isGridGroup);
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

  // Debounced version of drawGrid
  const debouncedDrawGrid = debounce(drawGrid, 100);

  // Removes grid lines only (without affecting other objects)
  const removeGrid = () => {
    if (!canvas) return;

    const existingGridGroup = canvas
      .getObjects()
      .find(
        (obj: fabric.Object & { isGridGroup?: boolean }) => obj.isGridGroup
      );
    if (existingGridGroup) {
      canvas.remove(existingGridGroup);
    }
    canvas.requestRenderAll();
  };

  // Storing references to the event handlers to properly remove them
  const gridEventHandlers = {
    wheel: debouncedDrawGrid,
    mouseDown: () => {
      canvas?.on("mouse:move", debouncedDrawGrid);
    },
    mouseUp: () => {
      canvas?.off("mouse:move", debouncedDrawGrid);
    },
  };

  // Handle toggle to enable/disable the grid
  const handleToggle = (checked: boolean) => {
    setGridEnabled(checked); // Update state for grid toggle

    if (checked) {
      drawGrid(); // Draws grid when enabled
      // event listeners for dynamic updates
      canvas?.on("mouse:wheel", gridEventHandlers.wheel);
      canvas?.on("mouse:down", gridEventHandlers.mouseDown);
      canvas?.on("mouse:up", gridEventHandlers.mouseUp);
    } else {
      removeGrid(); // Remove grid when disabled
      canvas?.off("mouse:wheel", gridEventHandlers.wheel);
      canvas?.off("mouse:down", gridEventHandlers.mouseDown);
      canvas?.off("mouse:up", gridEventHandlers.mouseUp);
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
  // for handling selection box when the shapes are being drawn

  const selectionSettings = {
    selection: true,
    selectionColor: "rgba(99, 101, 256, 0.3)",
    selectionBorderColor: "#0066ff",
    selectionLineWidth: 1,
  };

  const transparentSelectionSettings = {
    selection: false,
    selectionColor: "transparent",
    selectionBorderColor: "transparent",
    selectionLineWidth: 0,
  };

  useEffect(() => {
    if (!canvas) return;

    const handleMouseDown = (e: fabric.IEvent) => {
      if (currentTool !== "select") {
        canvas.set(transparentSelectionSettings);
        canvas.selection = false;
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
    };

    const handleMouseMove = (e: fabric.IEvent) => {
      if (drawingMode) {
        canvas.set(transparentSelectionSettings);
        canvas.selection = false;
        canvas.requestRenderAll();
      }
    };

    if (currentTool !== "select" || drawingMode) {
      canvas.set(transparentSelectionSettings);
      canvas.selection = false;
    } else {
      canvas.set(selectionSettings);
      canvas.selection = true;
    }

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
    };
  }, [canvas, currentTool, drawingMode]);

  //
  let c = canvas;

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
          <SideSheet
            onExport={() => {
              if (canvas) {
                const dataURL = canvas.toDataURL();
                const link = document.createElement("a");
                link.download = "canvas-export.png";
                link.href = dataURL;
                link.click();
              }
            }}
          />
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
        {/** */}
        <div className="absolute bottom-4 left-44 z-20 flex items-center space-x-2 ">
          <UndoRedo />
        </div>
      </div>
    </div>
  );
};

export default CanvasPage;
