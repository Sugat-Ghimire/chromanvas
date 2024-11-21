import { create } from "zustand";
interface zoomtype {
  newZoom: number;
  zoom: number;
}
const useZoomStore = create((set) => ({
  zoom: 1,
  incrementZoom: () => set((state: zoomtype) => ({ zoom: state.zoom + 0.01 })),

  decrementZoom: () =>
    set((state: zoomtype) => {
      if (state.zoom > 0.01) {
        return { zoom: state.zoom - 0.01 };
      } else {
        return state;
      }
    }),
}));

export default useZoomStore;
