import { useEffect, useState } from "react";
import { fabric } from "fabric";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlignJustify,
  Download,
  Paintbrush,
  Info,
  File,
  Github,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { SketchPicker } from "react-color";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Image from "next/image";
import { useCanvasStore } from "@/store/useCanvasStore";
import useImageStore from "@/store/useImageStore";

export default function UtilitySidebar({ onExport }) {
  const canvas = useCanvasStore((state) => state.canvas);

  const [canvasColor, setCanvasColor] = useState(
    canvas?.backgroundColor || "#FBFBFC"
  );
  const [theme, setTheme] = useState("system"); // Tracks selected theme mode

  const handleColorChange = (color) => {
    setCanvasColor(color.hex);
  };
  const [showColorPicker, setShowColorPicker] = useState(false);
  const setImageStore = useImageStore((state: any) => state.setImageStore);

  useEffect(() => {
    canvas?.set({
      backgroundColor: canvasColor,
    });
    canvas?.renderAll();
  }, [canvasColor, canvas]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.remove("dark");
      // System default logic can be applied here if needed
    }
  };
  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => {
        const data = f.target?.result as string;
        fabric.Image.fromURL(data, (img) => {
          img.set({
            left: Math.random() * 400,
            top: Math.random() * 400,
            angle: 0,
            padding: 0,
            cornerSize: 10,
          });
          img.scaleToWidth(300);
          img.scaleToHeight(300);

          setImageStore(img);
          canvas?.add(img);
          canvas?.setActiveObject(img);
        });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <Sheet>
      <SheetTrigger>
        <AlignJustify className="w-8 h-8 cursor-pointer hover:text-blue-500 transition-colors duration-200 dark:text-gray-900 " />
      </SheetTrigger>
      <SheetContent className="w-[192px] top-20 h-4/5 sm:w-[240px] p-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-white pt-4 my-[9px] mx-7 rounded-xl">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            App Utilities
          </SheetTitle>
        </SheetHeader>
        <div className="h-[1px] bg-gray-300 my-0 w-full -mt-2"></div>
        {/* Dark Mode Toggle Group */}
        <div className="mb-6 mt-3">
          <h3 className="text-sm font-semibold mb-2">Theme</h3>
          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={(value) => handleThemeChange(value)}
            className="w-full flex justify-between items-center"
          >
            <ToggleGroupItem
              value="light"
              className="w-1/3 flex flex-col items-center"
            >
              <Sun className="w-5 h-5 mb-1" />
              Light
            </ToggleGroupItem>
            <ToggleGroupItem
              value="dark"
              className="w-1/3 flex flex-col items-center"
            >
              <Moon className="w-5 h-5 mb-1" />
              Dark
            </ToggleGroupItem>
            <ToggleGroupItem
              value="system"
              className="w-1/3 flex flex-col items-center"
            >
              <Monitor className="w-5 h-5 mb-1" />
              System
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Canvas Color Picker */}
        <div className="mb-6 ">
          <h3 className="text-sm font-semibold mb-2">Canvas Color</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                className="w-full flex items-center justify-between"
              >
                <Paintbrush className="mr-2" /> Select Color
              </Button>
            </PopoverTrigger>

            <Input
              id="canvasColor"
              type="text"
              onClick={() => setShowColorPicker(!showColorPicker)}
              readOnly
              className="w-52 cursor-pointer -mt-10 opacity-0"
              style={{ backgroundColor: canvasColor }}
            />
            {showColorPicker && (
              <div className="absolute ">
                <SketchPicker
                  color={canvasColor}
                  onChangeComplete={handleColorChange}
                  style={{}}
                />
              </div>
            )}
          </Popover>
        </div>
        {/* Export Options */}
        <div className="mb-6 z-0">
          <h3 className="text-sm font-semibold mb-2">Export</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="w-full flex items-center justify-between"
              >
                <Download className="mr-2" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {["PNG", "JPEG", "PDF", "WebP"].map((format) => (
                <DropdownMenuItem
                  key={format}
                  onClick={() => onExport(format.toLowerCase())}
                >
                  {format}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Upload Image</h3>
          <label className="flex items-center w-full cursor-pointer">
            <File className="mr-2 text-gray-500 dark:text-white" />
            <div className="w-48 h-10 text-sm p-1 flex justify-center items-center gap-3 border border-slate-200 rounded-md text-gray-900 dark:text-gray-300">
              <span className="font-medium">Choose File </span>
              <span className="text-gray-700 dark:text-gray-200">No ...en</span>
            </div>
            <Input type="file" onChange={onFileUpload} className="hidden" />
          </label>
        </div>

        {/* Information Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            <Info className="mr-2" /> Help & Info
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
