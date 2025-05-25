"use client";
import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { Input } from "@/components/ui/input";
import { fabric } from "fabric";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCanvasStore } from "@/store/useCanvasStore";
import { Slider } from "@/components/ui/slider";

export default function RectPropToggler() {
  const canvas = useCanvasStore((state: any) => state.canvas);

  const setCanvas = useCanvasStore((state: any) => state.setCanvas);

  const activeObject = canvas.getActiveObject();
  const [x, setX] = useState(parseInt(activeObject?.left) || 0);
  const [y, setY] = useState(parseInt(activeObject?.top) || 0);
  const [width, setWidth] = useState(parseInt(activeObject?.width) || 0);
  const [height, setHeight] = useState(parseInt(activeObject?.height) || 0);
  const [b_radius, setB_Radius] = useState(activeObject?.rx || 0);
  const [strokeWidth, setStrokeWidth] = useState(
    activeObject?.strokeWidth || 0
  );
  const [opacity, setOpacity] = useState(activeObject?.opacity || 1);
  const [angle, setAngle] = useState(parseInt(activeObject?.angle) || 0);

  const [color, setColor] = useState(
    activeObject?.gradient?.colorStops[0].color ||
      activeObject?.fill ||
      "#ece5e5"
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

  const handleColorChange = (color: any) => setColor(color.hex);
  const handleBorderColorChange = (color: any) => setBorderColor(color.hex);
  const handleGradientColorChange = (color: any) => setGradientColor(color.hex);
  const handleGradientTypeChange = (value: any) => setGradientType(value);
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
            color || activeObject?.gradient?.colorStops[0]?.color || "#ece5e5",
          left: x,
          top: y,
          opacity: opacity,
          stroke: borderColor,
          height: height,
          rx: b_radius,
          ry: b_radius,
          strokeWidth: strokeWidth,
          gradient: null,
          angle: angle,
        });
        return;
        break;
    }

    activeObject.set({
      fill: gradient,
      left: x,
      top: y,
      width: width,
      height: height,
      rx: b_radius,
      ry: b_radius,
      opacity: opacity,
      stroke: borderColor,
      strokeWidth: strokeWidth,
      gradient: gradientColor,
      angle: angle,
    });
    activeObject.gradient = gradient;
  };

  useEffect(() => {
    if (!activeObject) return;

    activeObject.set({
      left: x,
      top: y,
      opacity,
      strokeWidth,
      width,
      height,
      rx: b_radius,
      ry: b_radius,
      stroke: borderColor,
      angle: angle,
      gradient: gradientColor,
    });

    applyGradient();
    activeObject.setCoords();
    canvas.renderAll();
  }, [
    x,
    y,
    width,
    height,
    opacity,
    b_radius,
    strokeWidth,
    borderColor,
    gradientType,
    color,
    gradientColor,
    angle,
  ]);

  return (
    <div className="absolute top-24 left-2 z-20 w-56">
      <div className="z-10 flex flex-col bg-muted h-[550px] w-60 rounded-2xl opacity-95 drop-shadow-lg h-55">
        <div className="p-4 flex flex-col gap-3 h-13">
          <h2 className="text-lg font-semibold">Design</h2>
          <div className="h-[1px] bg-gray-300 my-0 w-full -mt-2"></div>{" "}
          {/* Thin line */}
        </div>
        <div className="flex bg-muted ">
          <aside className="w-64 border-r p-4">
            <div className="space-y-1">
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
                    htmlFor="radius"
                    className="block text-sm font-medium text-foreground"
                  >
                    Border Radius
                  </label>
                  <Input
                    id="radius"
                    type="number"
                    value={b_radius}
                    onChange={(e) => setB_Radius(parseInt(e.target.value))}
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
                    className="mt-1 block w-24 "
                  />
                </div>
                {/**gradient color placed here! */}
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
              <div className="pt-3">
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
