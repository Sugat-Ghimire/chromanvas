import { fabric } from "fabric";
export function drawCircle(canvas: any, pointer: any) {
  let shape: fabric.Object | null = null;
  shape = shape = new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 0,
    fill: "#ece5e5",
    strokeWidth: 0,
    stroke: "#6b6868",
  });
  return shape;
}
