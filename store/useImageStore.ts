import { create } from "zustand";

const useImageStore = create((set) => ({
  image: null,

  setImageStore: (image: fabric.Image) =>
    set(() => {
      return { image: image };
    }),
}));

export default useImageStore;
