import { create } from "zustand";
//store for main canvas state
const useCanvasStore = create((set) => ({
  canvas: null,
  setCanvas: (canvasInstance: fabric.Canvas | null) =>
    set(() => ({ canvas: canvasInstance })),
}));

const useDrawingModeStore = create((set) => ({
  drawingMode: "",
  prevMode: "",
  setDrawingMode: (mode: string | null) =>
    set((state: any) => {
      const prevMode = state.drawingMode;
      return { drawingMode: mode, prevMode: prevMode };
    }),
}));

///////////////
////////////////
export { useCanvasStore, useDrawingModeStore };
