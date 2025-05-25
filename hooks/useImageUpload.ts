import { fabric } from "fabric";
import { useCanvasStore } from "@/store/useCanvasStore";
import useImageStore from "@/store/useImageStore";
import { useCallback } from "react";

const useImageUploader = () => {
  const canvas = useCanvasStore((state: any) => state.canvas);
  const setImageStore = useImageStore((state: any) => state.setImageStore);
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
        e.target.value = "";
      }
    },
    [canvas, setImageStore]
  );

  return { handleFileChange };
};

export default useImageUploader;
