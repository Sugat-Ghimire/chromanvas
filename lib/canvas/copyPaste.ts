import { fabric } from "fabric";

let clipboard: fabric.Object | null = null;

function Copy(canvas: fabric.Canvas) {
  if (!canvas) return;

  const activeObject = canvas.getActiveObject();
  if (!activeObject) {
    console.warn("No object selected for copying.");
    return;
  }

  // Clone the active object
  activeObject.clone((cloned: fabric.Object) => {
    if (cloned) {
      // Offset cloned object for visibility
      cloned.set({
        left: (activeObject.left || 0) + 20,
        top: (activeObject.top || 0) + 20,
        evented: true, // Allow interactions
      });
      // Store in clipboard
      clipboard = cloned;
    }
  });
}
function Paste(canvas: fabric.Canvas) {
  if (!canvas || !clipboard) {
    console.warn("Nothing to paste. Copy an object first.");
    return;
  }

  clipboard.clone((cloned: fabric.Object) => {
    if (cloned) {
      canvas.add(cloned); // Add cloned object to canvas
      canvas.setActiveObject(cloned); // Set it as active for further manipulations
      canvas.requestRenderAll();
    }
  });
}
export { Copy, Paste };
