"use client";
import { useEffect, useState } from "react";
import { fabric } from "fabric";

import { SketchPicker } from "react-color";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useCanvasStore, useDrawingModeStore } from "@/store/useCanvasStore";

export default function CirclePropToggler() {
  const canvas = useCanvasStore((state) => state.canvas);
  if (!(canvas?.getActiveObject()?.type == "circle")) return;
  const setCanvas = useCanvasStore((state) => state.setCanvas);

  const activeObject = canvas.getActiveObject();
  const [x, setX] = useState(parseInt(activeObject?.left) || 0);
  const [y, setY] = useState(parseInt(activeObject?.top) || 0);
  const [radius, setRadius] = useState(parseInt(activeObject?.radius) || 10);
  const [strokeWidth, setStrokeWidth] = useState(
    parseInt(activeObject?.strokeWidth) || 1
  );
  const [opacity, setOpacity] = useState(activeObject?.opacity || 1);
  const [color, setColor] = useState(
    activeObject?.gradient?.colorStops[0].color || "#ece5e5"
  );
  const [borderColor, setBorderColor] = useState(
    activeObject?.stroke || "#6b6868"
  );
  const [gradientColor, setGradientColor] = useState(
    activeObject?.gradient?.colorStops[1].color || "#c9a6a6"
  );
  const [gradientType, setGradientType] = useState(
    activeObject?.gradient?.type || "none"
  );

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBorderColorPicker, setShowBorderColorPicker] = useState(false);
  const [showGradientColorPicker, setShowGradientColorPicker] = useState(false);

  const handleColorChange = (color) => setColor(color.hex);
  const handleBorderColorChange = (color) => setBorderColor(color.hex);
  const handleGradientColorChange = (color) => setGradientColor(color.hex);
  const handleGradientTypeChange = (value) => setGradientType(value);

  const applyGradient = () => {
    if (!activeObject) return;

    let gradient;
    const colorStops = [
      { offset: 0, color: color },
      { offset: 1, color: gradientColor },
    ];

    switch (gradientType) {
      case "linear":
        gradient = new fabric.Gradient({
          type: "linear",
          gradientUnits: "percentage",
          coords: { x1: 0, y1: 0, x2: 1, y2: 1 },
          colorStops,
        });
        break;

      case "radial":
        gradient = new fabric.Gradient({
          type: "radial",
          gradientUnits: "percentage",
          coords: { x1: 0.5, y1: 0.5, r1: 0, x2: 0.5, y2: 0.5, r2: 0.5 },
          colorStops,
        });
        break;

      case "none":
        activeObject.set({
          fill:
            color || activeObject?.gradient?.colorStops[0].color || "#ece5e5",
          left: x,
          top: y,
          opacity: opacity,
          radius: radius,
          stroke: borderColor,
          strokeWidth: strokeWidth,
          gradient: null,
        });
        return;
        break;
    }

    activeObject.set({
      fill: gradient,
      left: x,
      top: y,
      opacity: opacity,
      radius: radius,
      stroke: borderColor,
      strokeWidth: strokeWidth,
      gradient: gradientColor,
    });
    activeObject.gradient = gradient;
    activeObject?.setCoords();
    canvas?.renderAll();
  };

  useEffect(() => {
    if (!activeObject) return;

    activeObject.set({
      left: x,
      top: y,
      opacity,
      radius,
      strokeWidth,
      stroke: borderColor,
    });

    applyGradient();
    activeObject.setCoords();
    canvas.renderAll();
  }, [
    x,
    y,
    opacity,
    radius,
    strokeWidth,
    borderColor,
    gradientType,
    color,
    gradientColor,
  ]);

  return (
    <div className="absolute top-24 left-2 z-20 w-56">
      <div className="z-10 flex flex-col bg-muted h-[550px] w-60 rounded-2xl opacity-95 drop-shadow-lg h-55">
        <div className="p-4 flex flex-col gap-4 h-13">
          <h2 className="text-lg font-semibold">Design</h2>
          <div className="h-[1px] bg-gray-300 my-0 w-full -mt-2"></div>{" "}
          {/* Thin line */}
        </div>
        <div className="flex bg-muted ">
          <aside className="w-64 border-r p-4">
            <div className="space-y-2">
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
                    htmlFor="radius"
                    className="block text-sm font-medium text-foreground"
                  >
                    Radius
                  </label>
                  <Input
                    id="radius"
                    type="number"
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="mt-1 block w-24"
                  />
                </div>
                <div>
                  <label
                    htmlFor="strokeWidth"
                    className="block text-sm font-medium text-foreground"
                  >
                    Stroke Width
                  </label>
                  <Input
                    id="strokeWidth"
                    type="number"
                    value={strokeWidth}
                    onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                    className="mt-1 block w-24"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <div>
                  <label
                    htmlFor="color"
                    className="block text-sm font-medium text-foreground"
                  >
                    Fill Color
                  </label>
                  <Input
                    id="color"
                    type="text"
                    value={color}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    readOnly
                    className="mt-1 block w-24 cursor-pointer"
                    style={{ backgroundColor: color }}
                  />
                  {showColorPicker && (
                    <div className="absolute z-10 mt-2">
                      <SketchPicker
                        color={color}
                        onChangeComplete={handleColorChange}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="gradientColor"
                    className="block text-sm font-medium text-foreground"
                  >
                    Gradient Color
                  </label>
                  <Input
                    id="gradientColor"
                    type="text"
                    value={gradientColor}
                    onClick={() =>
                      setShowGradientColorPicker(!showGradientColorPicker)
                    }
                    readOnly
                    className="mt-1 block w-24 cursor-pointer"
                    style={{ backgroundColor: gradientColor }}
                  />
                  {showGradientColorPicker && (
                    <div className="absolute z-10 mt-2">
                      <SketchPicker
                        color={gradientColor}
                        onChangeComplete={handleGradientColorChange}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <div>
                  <label
                    htmlFor="borderColor"
                    className="block text-sm font-medium text-foreground"
                  >
                    Border Color
                  </label>
                  <Input
                    id="borderColor"
                    type="text"
                    value={borderColor}
                    onClick={() =>
                      setShowBorderColorPicker(!showBorderColorPicker)
                    }
                    readOnly
                    className="mt-1 block w-24 cursor-pointer"
                    style={{ backgroundColor: borderColor }}
                  />
                  {showBorderColorPicker && (
                    <div className="absolute z-10 mt-2">
                      <SketchPicker
                        color={borderColor}
                        onChangeComplete={handleBorderColorChange}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="pb-2 pl-1">
                <label
                  htmlFor="opacity"
                  className="block text-sm font-medium text-foreground mb-1"
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
              <div>
                <Select onValueChange={handleGradientTypeChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Gradient Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                    <SelectItem value="none">None</SelectItem>
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
