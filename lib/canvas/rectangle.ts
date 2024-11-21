import { fabric } from "fabric";
export function drawRectangle(canvas: any, pointer: any) {
  let shape: fabric.Object | null = null;
  shape = new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    fill: "#ece5e5",
    width: 0,
    height: 0,
    strokeWidth: 0,
  });
  return shape;
}
