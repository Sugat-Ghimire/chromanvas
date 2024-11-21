import { create } from "zustand";

const useImageStore = create((set) => ({
  image: null, // Initially set to null, but this will hold the fabric.Image instance.

  // Method to set the image in the store (Fabric.js image)

  setImageStore: (image) =>
    set(() => {
      return { image: image };
    }),
}));

export default useImageStore;
