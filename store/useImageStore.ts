import { create } from "zustand";

const useImageStore = create((set) => ({
  image: null,

  setImageStore: (image) =>
    set(() => {
      return { image: image };
    }),
}));

export default useImageStore;
