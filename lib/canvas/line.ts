import { fabric } from "fabric";
export function drawLine(canvas: any, pointer: any) {
  let shape: fabric.Object | null = null;
  const points = [pointer.x, pointer.y, pointer.x, pointer.y];

  shape = new fabric.Line(points, {
    stroke: "#7c6a6a",
    strokeWidth: 1,
    angle: 0,
    strokeLineCap: "butt",
  });
  return shape;
}
