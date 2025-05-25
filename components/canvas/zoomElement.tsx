"use client";
import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import useZoomStore from "@/store/useZoomStore";
import { Plus, Minus } from "lucide-react";

const ZoomElement = () => {
  const zoom = useZoomStore((state: any) => state.zoom);
  const setZoom = useZoomStore((state: any) => state.setZoom);
  const incrementZoom = useZoomStore((state: any) => state.incrementZoom);
  const decrementZoom = useZoomStore((state: any) => state.decrementZoom);
  const incrementRef = useRef<NodeJS.Timeout | null>(null);
  const decrementRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDownIncrement = () => {
    incrementRef.current = setInterval(() => {
      incrementZoom();
    }, 100);
  };

  const handleMouseDownDecrement = () => {
    decrementRef.current = setInterval(() => {
      decrementZoom();
    }, 100);
  };

  const clearIncrement = () => {
    if (incrementRef.current) {
      clearInterval(incrementRef.current);
      incrementRef.current = null;
    }
  };

  const clearDecrement = () => {
    if (decrementRef.current) {
      clearInterval(decrementRef.current);
      decrementRef.current = null;
    }
  };

  // Cleans up intervals on unmount
  useEffect(() => {
    return () => {
      clearIncrement();
      clearDecrement();
    };
  }, []);
  return (
    <div id="zoomControl" className="absolute w-32 h-56 ml-0.5 mt-7  z-50 ">
      <div className="z-10 sticky w-32 ">
        <div className="flex items-center justify-center rounded-lg bg-pink-100 p-2 dark:bg-gray-900">
          <button
            className="text-black font-medium text-sm py-1 px-3 rounded-l-md "
            onClick={decrementZoom}
            onMouseDown={handleMouseDownDecrement}
            onMouseUp={clearDecrement}
            onMouseLeave={clearDecrement}
          >
            <Minus size={18} className="dark:text-white" />
          </button>
          <div className=" h-full border-solid border-slate-950 w-px"></div>
          <div className="mx-1 text-lg font-normal">
            {Math.ceil(zoom * 100)}%
          </div>
          <div className=" h-full border-solid border-slate-950 w-px"></div>
          <button
            className="text-black font-medium text-sm py-1 px-3 rounded-r-md"
            onClick={incrementZoom}
            onMouseDown={handleMouseDownIncrement}
            onMouseUp={clearIncrement}
            onMouseLeave={clearIncrement}
          >
            <Plus size={18} className="dark:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZoomElement;
