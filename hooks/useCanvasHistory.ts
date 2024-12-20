import { useCallback, useEffect, useState, useRef } from "react";
import { fabric } from "fabric";
import debounce from "lodash/debounce";

const useCanvasHistory = (canvas: fabric.Canvas | null) => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isInitialized = useRef(false);

  const saveState = useCallback(() => {
    if (!canvas) return;
    try {
      const json = JSON.stringify(
        canvas.toJSON([
          "selectable",
          "name",
          "radius",
          "width",
          "height",
          "evented",
          "objectCaching",
          "transparentCorners",
          "fill",
          "stroke",
          "strokeWidth",
          "scaleX",
          "scaleY",
          "angle",
          "opacity",
          "originX",
          "originY",
          "top",
          "left",
          "skewX",
          "skewY",
          "type",
        ])
      );

      setHistory((prevHistory) => {
        if (prevHistory[currentIndex] === json) return prevHistory;
        const newHistory = [...prevHistory.slice(0, currentIndex + 1), json];
        setCurrentIndex(newHistory.length - 1);
        return newHistory;
      });
    } catch (error) {
      console.error("Failed to save state:", error);
    }
  }, [canvas, currentIndex]);

  const debouncedSaveState = useCallback(
    debounce(saveState, 300, { maxWait: 1000 }),
    [saveState]
  );

  const undo = useCallback(() => {
    if (!canvas || currentIndex <= 0) return;
    try {
      const previousState = history[currentIndex - 1];
      if (!previousState) return;

      canvas.clear();
      canvas.loadFromJSON(JSON.parse(previousState), () => {
        canvas.renderAll();
        setCurrentIndex((prev) => prev - 1);
      });
    } catch (error) {
      console.error("Failed to undo:", error);
    }
  }, [canvas, history, currentIndex]);

  const redo = useCallback(() => {
    if (!canvas || currentIndex >= history.length - 1) return;
    try {
      const nextState = history[currentIndex + 1];
      if (!nextState) return;

      canvas.clear();
      canvas.loadFromJSON(JSON.parse(nextState), () => {
        canvas.renderAll();
        setCurrentIndex((prev) => prev + 1);
      });
    } catch (error) {
      console.error("Failed to redo:", error);
    }
  }, [canvas, history, currentIndex]);

  // Initialize history
  useEffect(() => {
    if (!canvas || isInitialized.current) return;

    setTimeout(() => {
      saveState();
      isInitialized.current = true;
    }, 100);
  }, [canvas, saveState]);

  // Setup canvas event listeners
  useEffect(() => {
    if (!canvas) return;

    const events: (keyof fabric.IEvent)[] = [
      "object:added",
      "object:modified",
      "object:removed",
      "path:created",
      "object:skewing",
      "object:rotating",
      "object:scaling",
      "object:moved",
      "text:changed",
    ];

    events.forEach((event) => {
      canvas.on(event, debouncedSaveState);
    });

    return () => {
      debouncedSaveState.cancel();
      events.forEach((event) => {
        canvas.off(event, debouncedSaveState);
      });
    };
  }, [canvas, debouncedSaveState]);

  return {
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    saveState,
  };
};

export default useCanvasHistory;
