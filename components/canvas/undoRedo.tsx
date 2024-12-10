import { Undo, Redo } from "lucide-react";
export default function UndoRedo() {
  return (
    <div
      className="flex bg-muted gap-5 cursor-pointer rounded-lg
    w-24 h-11  bg-pink-100 p-1 dark:bg-gray-900 justify-evenly items-center"
    >
      <Undo size={24} />
      <Redo size={24} />
    </div>
  );
}
