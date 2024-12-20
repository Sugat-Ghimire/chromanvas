import React, { useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useCanvasStore } from "@/store/useCanvasStore";
import useCanvasHistory from "@/hooks/useCanvasHistory";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

const UndoRedo = () => {
  const canvas = useCanvasStore((state) => state.canvas);
  const { undo, redo, canUndo, canRedo } = useCanvasHistory(canvas);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo) redo();
        } else {
          if (canUndo) undo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [undo, redo, canUndo, canRedo]);

  if (!canvas) return null;

  return (
    <div
      className="flex items-center space-x-2"
      role="toolbar"
      aria-label="Canvas history controls"
    >
      <TooltipProvider>
        <Tooltip content="Undo (Ctrl+Z)">
          <button
            onClick={undo}
            disabled={!canUndo}
            aria-label="Undo last action"
            className={`p-2 rounded-md transition-colors ${
              canUndo
                ? "hover:bg-gray-200 text-gray-800 active:bg-gray-300"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        </Tooltip>
        <Tooltip content="Redo (Ctrl+Shift+Z)">
          <button
            onClick={redo}
            disabled={!canRedo}
            aria-label="Redo last action"
            className={`p-2 rounded-md transition-colors ${
              canRedo
                ? "hover:bg-gray-200 text-gray-800 active:bg-gray-300"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            <ArrowRightIcon className="h-6 w-6" />
          </button>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default UndoRedo;
