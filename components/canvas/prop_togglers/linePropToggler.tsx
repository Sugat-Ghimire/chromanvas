"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { SketchPicker } from "react-color";
import { fabric } from "fabric";
import { useCanvasStore, useDrawingModeStore } from "@/store/useCanvasStore";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function LinePropToggler() {
  const canvas = useCanvasStore((state: any) => state.canvas);
  const setCanvas = useCanvasStore((state: any) => state.setCanvas);
  const activeObject = canvas.getActiveObject();

  const [x, setX] = useState(parseInt(activeObject?.left) || 0);
  const [y, setY] = useState(parseInt(activeObject?.top) || 0);
  const [width, setWidth] = useState(activeObject?.scaleX * 100 || 33);
  const [height, setHeight] = useState(activeObject?.scaleY * 100 || 33);
  const [opacity, setOpacity] = useState(activeObject?.opacity || 1);
  const [angle, setAngle] = useState(activeObject?.angle || 0);
  const [strokeWidth, setStrokeWidth] = useState(
    activeObject?.strokeWidth || 1
  );

  const [color, setColor] = useState(activeObject?.stroke || "#7c6a6a");

  const [showBorderColorPicker, setShowBorderColorPicker] = useState(false);
  const [strokeLineCap, setStrokeLineCap] = useState(
    activeObject?.strokeLineCap || "round"
  );

  const handleStrokeLineCap = (value: any) => {
    return setStrokeLineCap(value);
  };
  const handleColorChange = (color: any) => setColor(color.hex);
  useEffect(() => {
    if (!activeObject) return;

    setX(parseInt(activeObject?.left) || 0);
    setY(parseInt(activeObject?.top) || 0);
    setWidth(activeObject?.scaleX * 100 || 33);
    setHeight(activeObject?.scaleY * 100 || 33);
    setOpacity(activeObject?.opacity || 1);
    setAngle(activeObject?.angle || 0);
    setStrokeWidth(activeObject?.strokeWidth || 1);
    setColor(activeObject?.stroke || "#7c6a6a");
    setStrokeLineCap(activeObject?.strokeLineCap || "round");
  }, [activeObject]);

  // Update active object properties
  useEffect(() => {
    if (!activeObject) return;

    activeObject.set({
      left: x,
      top: y,
      scaleX: width / 100,
      scaleY: height / 100,
      opacity,
      stroke: color,
      strokeWidth,
      strokeLineCap,
      angle,
    });

    activeObject.setCoords();
    canvas.renderAll();
  }, [
    x,
    y,
    width,
    height,
    opacity,
    color,
    angle,
    strokeWidth,
    strokeLineCap,
    activeObject,
    canvas,
  ]);

  if (!activeObject) {
    return null;
  }

  return (
    <div className="absolute top-24 left-2 z-20 w-56">
      <div className="z-10 flex flex-col bg-muted h-[550px] w-60 rounded-2xl opacity-95 drop-shadow-lg h-55">
        <div className="p-4 flex flex-col gap-4 h-13">
          <h2 className="text-lg font-semibold">Design</h2>
          <div className="h-[1px] bg-gray-300 my-0 w-full -mt-2"></div>{" "}
          {/* Thin line */}
        </div>
        <div className="flex bg-muted">
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
                    Width
                  </label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value))}
                    className="mt-1 block w-24"
                  />
                </div>
                <div>
                  <label
                    htmlFor="strokeWidth"
                    className="block text-sm font-medium text-foreground"
                  >
                    strokeWidth
                  </label>

                  <Input
                    id="strokeWidth"
                    type="number"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                    className="mt-1 block w-24"
                    min={0}
                    max={100}
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
                    htmlFor="borderColor"
                    className="block text-sm font-medium text-foreground"
                  >
                    Border Color
                  </label>
                  <Input
                    id="color"
                    type="text"
                    value={color}
                    onClick={() =>
                      setShowBorderColorPicker(!showBorderColorPicker)
                    }
                    readOnly
                    className="mt-1 block w-24 cursor-pointer"
                    style={{ backgroundColor: color }}
                  />
                  {showBorderColorPicker && (
                    <div
                      className="absolute z-10 mt-2 block w-8 cursor-pointer"
                      style={{
                        top: 130,
                        right: 19,
                      }}
                    >
                      <SketchPicker
                        color={color}
                        onChangeComplete={handleColorChange}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">{/** */}</div>
              <div className="pl-1 pt-1">
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
              <div className="pt-3">
                <Select onValueChange={handleStrokeLineCap}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="strokeLineCap " />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="butt">Butt</SelectItem>
                    <SelectItem value="round">Round</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
