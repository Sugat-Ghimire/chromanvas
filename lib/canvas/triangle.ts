import { fabric } from "fabric";
export function drawTriangle(canvas: any, pointer: any) {
  let shape: fabric.Object | null = null;
  shape = new fabric.Triangle({
    left: pointer.x,
    top: pointer.y,
    fill: "#ece5e5",
    width: 0,
    strokeWidth: 0,
    height: 0,
  });
  return shape;
}
