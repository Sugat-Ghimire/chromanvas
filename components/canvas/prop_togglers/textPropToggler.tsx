"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Combobox from "@/components/ui/combobox";
import { FontToggle } from "@/components/canvas/fontToggle";
import { fabric } from "fabric";
import { useCanvasStore, useDrawingModeStore } from "@/store/useCanvasStore";
import { AlignLeft, AlignCenter, AlignRight, Highlighter } from "lucide-react";
import { SketchPicker } from "react-color";
import { Slider } from "@/components/ui/slider";

export default function TextPropToggler() {
  const canvas = useCanvasStore((state: any) => state.canvas);
  const setCanvas = useCanvasStore((state: any) => state.setCanvas);
  const activeObject = canvas.getActiveObject();

  const [x, setX] = useState(parseInt(activeObject?.left) || 0);
  const [y, setY] = useState(parseInt(activeObject?.top) || 0);
  const [angle, setAngle] = useState(parseInt(activeObject?.angle) || 0);
  const [opacity, setOpacity] = useState(activeObject?.opacity || 1);

  const [fontSize, setFontSize] = useState(activeObject?.fontSize || 25);
  const [height, setHeight] = useState(activeObject?.scaleY * 100 || 100);
  const [color, setColor] = useState("#000000");

  const [strokeWidth, setStrokeWidth] = useState(
    activeObject?.strokeWidth || 1
  );
  const [highlightColor, setHighlightColor] = useState("#ffff00");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightColorPicker, setShowHighlightColorPicker] =
    useState(false);

  const handleColorChange = (color: any) => {
    setColor(color.hex);
  };
  const handleHighlightColorChange = (color: any) => {
    setHighlightColor(color.hex);
  };
  const [align, setAlign] = useState(activeObject?.textAlign || "left");
  const handleTextAlignChange = (align: string) => {
    setAlign(align);
  };
  useEffect(() => {
    if (!activeObject) return;
    activeObject.set({
      left: x,
      top: y,
      opacity,
      strokeWidth,
      fontSize,
      scaleY: height / 100,
      stroke: color,
      angle: angle,
      textAlign: align,
    });

    activeObject.setCoords();
    canvas.renderAll();
  }, [
    x,
    y,
    fontSize,
    height,
    opacity,
    color,
    angle,
    strokeWidth,
    activeObject,
    canvas,
    align,
  ]);

  return (
    <div className="absolute top-24 left-2 z-20 w-56 ">
      <div className="z-10 flex flex-col bg-muted h-[560px] w-60 rounded-2xl opacity-95 drop-shadow-lg ">
        <div className="p-4 flex flex-col gap-4 h-13">
          <h2 className="text-lg font-semibold">Design</h2>
          <div className="h-[1px] bg-gray-300 my-0 w-full -mt-2"></div>{" "}
          {/* Thin line */}
        </div>
        <div className="flex bg-muted m-1 overflow-y-auto rounded-2xl overflow-x-hidden">
          <aside className="w-64 border-r p-4">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div>
                  <label
                    htmlFor="x"
                    className="block text-sm font-medium text-foreground ml-1"
                  >
                    X-Axis
                  </label>
                  <Input
                    id="x"
                    type="number"
                    value={x}
                    onChange={(e) => setX(parseInt(e.target.value))}
                    className="mt-1 block w-24"
                  />
                </div>
                <div>
                  <label
                    htmlFor="y"
                    className="block text-sm font-medium text-foreground ml-1"
                  >
                    Y-Axis
                  </label>
                  <Input
                    id="y"
                    type="number"
                    value={y}
                    onChange={(e) => setY(parseInt(e.target.value))}
                    className="mt-1 block w-24"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div>
                  <label
                    htmlFor="width"
                    className="block text-sm font-medium text-foreground"
                  >
                    FontSize
                  </label>
                  <Input
                    id="fontSize"
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="mt-1 block w-24"
                  />
                </div>
                <div>
                  <label
                    htmlFor="height"
                    className="block text-sm font-medium text-foreground"
                  >
                    Height
                  </label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className="mt-1 block w-24"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div>
                  <label
                    htmlFor="angle"
                    className="block text-sm font-medium text-foreground"
                  >
                    Angle
                  </label>
                  <Input
                    id="angle"
                    type="number"
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="mt-1 block w-24"
                  />
                </div>

                <div>
                  <label
                    htmlFor="thickness"
                    className="block text-sm font-medium text-foreground"
                  >
                    Stroke
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="stroke"
                      type="number"
                      value={strokeWidth}
                      onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                      className="w-24"
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
              </div>
              <Combobox />
              <div className="flex align-bottom">
                <div className="-ml-3">
                  <FontToggle />
                </div>
              </div>
              <div className="flex  items-center relative gap-1">
                <AlignLeft
                  className={
                    align === "left"
                      ? "bg-amber-400 text-white rounded-sm cursor-pointer hover:opacity-60"
                      : "cursor-pointer hover:opacity-60"
                  }
                  onClick={() => {
                    handleTextAlignChange("left");
                  }}
                />
                <AlignCenter
                  className={
                    align === "center"
                      ? "bg-amber-400 text-white rounded-sm cursor-pointer hover:opacity-60"
                      : "cursor-pointer hover:opacity-60"
                  }
                  onClick={() => {
                    handleTextAlignChange("center");
                  }}
                />
                <AlignRight
                  className={
                    align === "right"
                      ? "bg-amber-400 text-white rounded-sm cursor-pointer hover:opacity-60"
                      : "cursor-pointer hover:opacity-60"
                  }
                  onClick={() => {
                    handleTextAlignChange("right");
                  }}
                />
                <div
                  className="relative flex items-center"
                  onMouseEnter={() => setShowHighlightColorPicker(true)}
                  onMouseLeave={() => setShowHighlightColorPicker(false)}
                >
                  <Highlighter className="ml-1" strokeWidth={1.45} />
                  <Input
                    type="text"
                    value={highlightColor}
                    className=" ml-2 cursor-pointer w-20"
                  />
                  {showHighlightColorPicker && (
                    <div
                      className="absolute z-10"
                      style={{ right: 3, bottom: 50 }}
                    >
                      <SketchPicker
                        color={highlightColor}
                        onChange={handleHighlightColorChange}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="pl-1">
                <label
                  htmlFor="opacity"
                  className="block text-sm font-medium text-foreground pb-1"
                >
                  Opacity
                </label>
                <Slider
                  id="opacity"
                  defaultValue={[opacity]}
                  max={1}
                  step={0.01}
                  value={[opacity]}
                  onValueChange={(value) => setOpacity(value[0])}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-foreground"
                >
                  Color
                </label>
                <div
                  className="relative "
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <Input
                    id="color"
                    type="text"
                    value={color}
                    readOnly
                    className="mt-1 block cursor-pointer w-[200px]"
                  />
                  {showColorPicker && (
                    <div
                      className="absolute z-10"
                      style={{
                        bottom: 80,
                      }}
                    >
                      <SketchPicker
                        color={color}
                        onChange={handleColorChange}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
