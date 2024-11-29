"use client";
import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { Input } from "@/components/ui/input";
import { fabric } from "fabric";
import { useCanvasStore, useDrawingModeStore } from "@/store/useCanvasStore";
import useImageStore from "@/store/useImageStore";
import { Slider } from "@/components/ui/slider";

export default function ImagePropToggler() {
  const canvas = useCanvasStore((state) => state.canvas);
  const setCanvas = useCanvasStore((state) => state.setCanvas);
  const activeObject = canvas.getActiveObject();
  const [x, setX] = useState(parseInt(activeObject?.left) || 0);
  const [y, setY] = useState(parseInt(activeObject?.top) || 0);
  const [width, setWidth] = useState(activeObject?.scaleX * 100 || 33);
  const [height, setHeight] = useState(activeObject?.scaleY * 100 || 33);
  const [b_radius, setB_Radius] = useState(50);
  const [strokeWidth, setStrokeWidth] = useState(
    activeObject?.strokeWidth || 0
  );
  const [opacity, setOpacity] = useState(activeObject?.opacity || 1);
  const [angle, setAngle] = useState(activeObject?.angle || 0);
  const [showBorderColorPicker, setShowBorderColorPicker] = useState(false);
  const [borderColor, setBorderColor] = useState(
    activeObject?.stroke || "#c09191"
  );

  const handleBorderColorChange = (color: any) => setBorderColor(color.hex);
  const img = useImageStore((state) => state.image);
  const setDrawingMode = useDrawingModeStore(
    (state: any) => state.setDrawingMode
  );

  activeObject.set({
    left: x,
    top: y,
    scaleX: width / 100,
    scaleY: height / 100,
    opacity: opacity,
    stroke: borderColor,
    strokeWidth: strokeWidth,
    angle: angle,
  });
  //

  //
  useEffect(() => {
    if (!activeObject) return;

    activeObject.set({
      left: x,
      top: y,
      opacity,
      strokeWidth,
      scaleX: width / 100,
      scaleY: height / 100,
      stroke: borderColor,
      angle: angle,
    });

    activeObject.setCoords();
    canvas.renderAll();
  }, [
    x,
    y,
    width,
    height,
    opacity,
    strokeWidth,
    borderColor,
    angle,
    activeObject,
    canvas,
  ]);

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
                    htmlFor="width"
                    className="block text-sm font-medium text-foreground"
                  >
                    Width
                  </label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
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
                    onChange={(e) => setHeight(e.target.value)}
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
                {/** */}
                <div>
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
                    <div
                      className="absolute z-10 mt-2 block w-8 cursor-pointer"
                      style={{
                        top: 130,
                        right: 19,
                      }}
                    >
                      <SketchPicker
                        color={borderColor}
                        onChangeComplete={handleBorderColorChange}
                      />
                    </div>
                  )}
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
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
