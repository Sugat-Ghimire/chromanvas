import { fabric } from "fabric";
export function drawText(canvas: any, pointer: any) {
  let shape: fabric.Object | null = null;
  shape = new fabric.Textbox("", {
    left: pointer.x,
    top: pointer.y,
    width: 0,
    height: 0,
    fill: "black",
    fontSize: 25,
    fontStyle: "normal",
    fontFamily: "Verdana",
    // hasBorders: false, // Removes the border around the Textbox
    // hasControls: false,
    underline: false,
    linethrough: false,
  });

  return shape;
}
