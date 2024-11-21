import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup } from "@/components/ui/radio-group";

import LinePropToggler from "@/components/canvas/prop_togglers/linePropToggler";
import TextPropToggler from "@/components/canvas/prop_togglers/textPropToggler";
import CirclePropToggler from "@/components/canvas/prop_togglers/circlePropToggler";
import RectPropToggler from "@/components/canvas/prop_togglers/rectPropToggler";
import TrianglePropToggler from "@/components/canvas/prop_togglers/trianglePropToggler";
import ImagePropToggler from "@/components/canvas/prop_togglers/imgPropToggler";
import FreeDrawingModeToggler from "@/components/canvas/prop_togglers/freeDrawingModeToggler";
import { useDrawingModeStore } from "@/store/useCanvasStore";
import { Divide } from "lucide-react";

export default function SideBar() {
  const drawingMode = useDrawingModeStore((state) => state.drawingMode);

  const dm = drawingMode;

  const renderPropToggler = () => {
    switch (dm) {
      case "pencil":
        return <FreeDrawingModeToggler />;
      case "line":
        return <LinePropToggler />;
      case "text":
        return <TextPropToggler />;
      case "circle":
        return <CirclePropToggler />;
      case "rect":
        return <RectPropToggler />;
      case "triangle":
        return <TrianglePropToggler />;
      case "image":
        return <ImagePropToggler />;
      default:
        return null;
    }
  };
  if (drawingMode) {
    return (
      <div className="h-5/6 overflow-hidden -mt-4">{renderPropToggler()}</div>
    );
  } else {
    return <></>;
  }
}
