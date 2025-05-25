"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { SketchPicker } from "react-color";
import { fabric } from "fabric";
import { useCanvasStore } from "@/store/useCanvasStore";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FreeDrawingModeToggler() {
  const canvas = useCanvasStore((state: any) => state.canvas);

  const [brushType, setBrushType] = useState("PencilBrush");
  const [brushColor, setBrushColor] = useState("#eeaeae");
  const [brushWidth, setBrushWidth] = useState(5);
  const [brushOpacity, setBrushOpacity] = useState(1);

  const [shadowColor, setShadowColor] = useState("#ee7575");
  const [shadowBlur, setShadowBlur] = useState(10);
  const [shadowOffsetX, setShadowOffsetX] = useState(2);
  const [shadowOffsetY, setShadowOffsetY] = useState(2);

  const [showBrushColorPicker, setShowBrushColorPicker] = useState(false);
  const [showShadowColorPicker, setShowShadowColorPicker] = useState(false);
  const handleBrushColorChange = (color: any) => {
    setBrushColor(color.hex);
  };
  const handleShadowColorChange = (color: any) => {
    setShadowColor(color.hex);
  };
  useEffect(() => {
    if (!canvas) return;

    const rgbaColor = `rgba(${parseInt(brushColor.slice(1, 3), 16)}, ${parseInt(
      brushColor.slice(3, 5),
      16
    )}, ${parseInt(brushColor.slice(5, 7), 16)}, ${brushOpacity})`;

    const brush = new (fabric as any)[brushType](canvas);
    brush.color = rgbaColor;
    brush.width = brushWidth;
    brush.shadow = new fabric.Shadow({
      color: shadowColor,
      blur: shadowBlur,
      offsetX: shadowOffsetX,
      offsetY: shadowOffsetY,
    });
    canvas.freeDrawingBrush = brush;
  }, [
    canvas,
    brushType,
    brushColor,
    brushWidth,
    brushOpacity,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
  ]);

  return (
    <div className="absolute top-24 left-2 z-20 w-56">
      <div className="z-10 flex flex-col bg-muted h-[550px] w-60 rounded-2xl opacity-95 drop-shadow-lg">
        <div className="p-4 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Design</h2>
          <div className="h-[1px] bg-gray-300 w-full -mt-2"></div>
        </div>

        <div className="flex bg-muted">
          <aside className="w-64 border-r p-4 ">
            <div className="space-y-4">
              <div>
                <Select onValueChange={setBrushType}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Brush" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PencilBrush">Pencil</SelectItem>
                    <SelectItem value="CircleBrush">Circle</SelectItem>
                    <SelectItem value="SprayBrush">Spray</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <div>
                  <label className="block text-sm font-medium">
                    Brush Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={brushColor}
                      onChange={(e) => setBrushColor(e.target.value)}
                      onClick={() =>
                        setShowBrushColorPicker(!showBrushColorPicker)
                      }
                      className="mt-1 block w-24  cursor-pointer"
                      readOnly
                      style={{
                        backgroundColor: brushColor,
                      }}
                    />
                  </div>
                  {showBrushColorPicker && (
                    <SketchPicker
                      color={brushColor}
                      onChangeComplete={handleBrushColorChange}
                      className="absolute z-10 mt-2"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Brush Width
                  </label>
                  <Input
                    id="brushWidth"
                    type="number"
                    value={brushWidth}
                    onChange={(e) => setBrushWidth(parseInt(e.target.value))}
                    className="mt-1 block w-24 "
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium pb-2">
                  Brush Opacity
                </label>
                <Slider
                  defaultValue={[brushOpacity * 100]}
                  min={1}
                  max={100}
                  value={[brushOpacity * 100]}
                  onValueChange={(value) => setBrushOpacity(value[0] / 100)}
                />
              </div>
              <div className="h-[1px] bg-gray-200 w-full my-4"></div>{" "}
              {/* Divider */}
              <div className="flex gap-3">
                <div>
                  <label className="block text-sm font-medium">
                    Shadow Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={shadowColor}
                      onChange={(e) => setBrushColor(e.target.value)}
                      onClick={() =>
                        setShowShadowColorPicker(!showShadowColorPicker)
                      }
                      className="mt-1 block w-24  cursor-pointer"
                      readOnly
                      style={{
                        backgroundColor: shadowColor,
                      }}
                    />
                  </div>
                  {showShadowColorPicker && (
                    <SketchPicker
                      color={shadowColor}
                      onChangeComplete={handleShadowColorChange}
                      className="absolute z-10 mt-2"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Shadow Blur
                  </label>
                  <Input
                    type="number"
                    value={shadowBlur}
                    onChange={(e) => setShadowBlur(parseInt(e.target.value))}
                    className="mt-1 block w-24"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div>
                  <label className="block text-sm font-medium">Offset X</label>
                  <Input
                    type="number"
                    value={shadowOffsetX}
                    onChange={(e) => setShadowOffsetX(parseInt(e.target.value))}
                    className="mt-1 block w-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Offset Y</label>
                  <Input
                    type="number"
                    value={shadowOffsetY}
                    onChange={(e) => setShadowOffsetY(parseInt(e.target.value))}
                    className="mt-1 block w-24"
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
