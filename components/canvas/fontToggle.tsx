import { useState, useEffect } from "react";
import { fabric } from "fabric";

import { Bold, Italic, Underline } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCanvasStore } from "@/store/useCanvasStore";

export function FontToggle() {
  const canvas = useCanvasStore((state) => state.canvas);
  const activeObject = canvas?.getActiveObject();

  const [isBold, setIsBold] = useState(activeObject?.fontWeight === "bold");

  const [isItalic, setIsItalic] = useState(
    activeObject?.fontStyle === "italic"
  );
  const [isUnderline, setIsUnderline] = useState(
    activeObject?.underline || false
  );
  useEffect(() => {
    if (!activeObject) return;

    activeObject.set({
      fontWeight: isBold ? "bold" : "normal",
      fontStyle: isItalic ? "italic" : "normal",
      underline: isUnderline,
    });

    activeObject.setCoords();
    canvas.renderAll();
  }, [isBold, isItalic, isUnderline, activeObject, canvas]);

  return (
    <ToggleGroup type="multiple" className="flex space-x-1 ml-3">
      <ToggleGroupItem
        value="bold"
        aria-label="Toggle bold"
        className={isBold ? "bg-gray-400 text-black" : ""}
        onClick={() => setIsBold((prev) => !prev)}
      >
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="italic"
        aria-label="Toggle italic"
        onClick={() => setIsItalic((prev) => !prev)}
        className={isItalic ? "bg-gray-400 text-black" : ""}
      >
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="underline"
        aria-label="Toggle underline"
        onClick={() => setIsUnderline((prev) => !prev)}
        className={isUnderline ? "bg-gray-400 text-black" : ""}
      >
        <Underline className="h-4 w-4 mt-0.5" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
