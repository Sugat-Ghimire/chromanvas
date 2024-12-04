"use client";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import {
  CircleIcon,
  ImageIcon,
  PencilIcon,
  RectangleVerticalIcon,
  TrashIcon,
  TriangleIcon,
  Type,
  Hand,
  Slash,
  Eraser,
} from "lucide-react";
import { useCanvasStore, useDrawingModeStore } from "@/store/useCanvasStore";
import { useEffect, useState } from "react";
import useImageStore from "@/store/useImageStore";
import useImageUploader from "@/hooks/useImageUpload";

export default function Header({ fileInputRef }: { fileInputRef: any }) {
  const canvas = useCanvasStore((state: any) => state.canvas);
  const setCanvas = useCanvasStore((state: any) => state.setCanvas);
  const setImageStore = useImageStore((state: any) => state.setImageStore);
  const [eraserEnabled, setEraserEnabled] = useState(false);
  const drawingMode = useDrawingModeStore((state: any) => state.drawingMode);
  const setDrawingMode = useDrawingModeStore(
    (state: any) => state.setDrawingMode
  );

  // Panning state for toggling panning on/off
  const [panningEnabled, setPanningEnabled] = useState(false);
  const { handleFileChange } = useImageUploader();
  const handleShapeIconClick = (shape: string) => {
    setDrawingMode(shape);
    if (canvas) {
      canvas.isDrawingMode = shape === "pencil";
    }
    setPanningEnabled(false); // Turn off panning when selecting a drawing mode
  };

  const clearCanvas = () => {
    canvas?.getObjects().forEach((obj: any) => {
      if (obj !== canvas.backgroundImage) {
        canvas.remove(obj);
      }
    });
    canvas?.renderAll();
  };

  // Toggle panning feature
  const handlePanningToggle = () => {
    setPanningEnabled(!panningEnabled); // Toggle panning state
  };

  // Initialize panning behavior based on panningEnabled state
  useEffect(() => {
    if (!canvas) return;

    let startPoint = { x: 0, y: 0 };
    let isPanning = false;

    const onMouseDown = (event: any) => {
      if (!panningEnabled || event.target) return;
      isPanning = true;
      startPoint = {
        x: event.e.clientX,
        y: event.e.clientY,
      };
      canvas.selection = false;
    };

    const onMouseMove = (event: any) => {
      if (isPanning && panningEnabled) {
        const delta = {
          x: event.e.clientX - startPoint.x,
          y: event.e.clientY - startPoint.y,
        };
        canvas.relativePan(new fabric.Point(delta.x, delta.y));
        startPoint = {
          x: event.e.clientX,
          y: event.e.clientY,
        };
      }
    };

    const onMouseUp = () => {
      isPanning = false;
      canvas.selection = true;
    };

    canvas.on("mouse:down", onMouseDown);
    canvas.on("mouse:move", onMouseMove);
    canvas.on("mouse:up", onMouseUp);

    // Cleanup events when the component unmounts or canvas changes.
    return () => {
      canvas.off("mouse:down", onMouseDown);
      canvas.off("mouse:move", onMouseMove);
      canvas.off("mouse:up", onMouseUp);
    };
  }, [canvas, panningEnabled]); // Re-run effect when panningEnabled changes.

  const [isFreeDrawing, setFreeDrawing] = useState(false);

  const handleFreeDrawing = () => {
    handleShapeIconClick("pencil");
    setFreeDrawing(true);
    if (isFreeDrawing) {
      if (canvas) canvas.isDrawingMode = false;
      setDrawingMode(null);
      setFreeDrawing(false);
    }
  };
  const handleEraserToggle = () => {
    if (!canvas) return;
    setEraserEnabled((prev) => !prev);

    if (eraserEnabled) {
      canvas.defaultCursor = "default";
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");
      canvas.remove(canvas.__eraserCursor); // Removing eraser cursor
      delete canvas.__eraserCursor;
      delete canvas.__isEraserMode;
      canvas.renderAll();
    } else {
      // Enabling eraser mode
      setEraserEnabled(true);

      // Hiding the default mouse cursor
      canvas.defaultCursor = "none";

      const eraserCursor = new fabric.Circle({
        radius: 10,
        fill: "rgba(255, 0, 0, 0.5)",
        selectable: false,
        evented: false,
        originX: "center",
        originY: "center",
      });
      canvas.__eraserCursor = eraserCursor;
      canvas.add(eraserCursor);

      let isMouseDown = false;

      const onMouseDown = (event: fabric.IEvent) => {
        if (event.e.button === 0) {
          // Left mouse button
          isMouseDown = true;
          canvas.selection = false;
        }
      };
      const onMouseMove = (event: fabric.IEvent) => {
        const pointer = canvas.getPointer(event.e);
        eraserCursor.set({ left: pointer.x, top: pointer.y });
        eraserCursor.setCoords();
        if (isMouseDown) {
          const target = canvas.findTarget(event.e, false);
          if (target && target !== canvas.backgroundImage) {
            canvas.remove(target);
          }
        }

        canvas.renderAll();
      };

      const onMouseUp = () => {
        isMouseDown = false;
        canvas.selection = true;
      };

      canvas.on("mouse:down", onMouseDown);
      canvas.on("mouse:move", onMouseMove);
      canvas.on("mouse:up", onMouseUp);
    }
  };

  return (
    <header className="opacity-95 z-10 absolute border-b border-muted p-4 flex items-center justify-between h-16 w-full bg-[#EBEDF3] dark:bg-gray-800">
      <h1 className="text-3xl font-bold">Chromanvas</h1>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePanningToggle}
          className={panningEnabled ? "bg-blue-500 text-white" : ""}
        >
          <Hand className="w-5 h-5" />
          <span className="sr-only">Toggle Panning</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleShapeIconClick("text")}
          className={drawingMode === "text" ? "bg-blue-500 text-white" : ""}
        >
          <Type className="w-5 h-5" />
          <span className="sr-only">Text</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            handleFreeDrawing();
          }}
          className={drawingMode === "pencil" ? "bg-blue-500 text-white" : ""}
        >
          <PencilIcon className="w-5 h-5" />
          <span className="sr-only">Pencil</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleShapeIconClick("circle")}
          className={drawingMode === "circle" ? "bg-blue-500 text-white" : ""}
        >
          <CircleIcon className="w-5 h-5" />
          <span className="sr-only">Circle</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleEraserToggle}
          className={eraserEnabled ? "bg-blue-500 text-white" : ""}
        >
          <Eraser />
          <span className="sr-only">Eraser</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleShapeIconClick("rect")}
          className={drawingMode === "rect" ? "bg-blue-500 text-white" : ""}
        >
          <RectangleVerticalIcon className="w-5 h-5" />
          <span className="sr-only">Rectangle</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleShapeIconClick("triangle")}
          className={drawingMode === "triangle" ? "bg-blue-500 text-white" : ""}
        >
          <TriangleIcon className="w-5 h-5" />
          <span className="sr-only">Triangle</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleShapeIconClick("line")}
          className={drawingMode === "line" ? "bg-blue-500 text-white" : ""}
        >
          <Slash className="w-5 h-5" />
          <span className="sr-only">Line</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-5 h-5" />
          <span className="sr-only">Image</span>
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button variant="destructive" size="icon" onClick={clearCanvas}>
          <TrashIcon className="w-5 h-5" />
          <span className="sr-only">Clear Canvas</span>
        </Button>
      </div>
    </header>
  );
}
