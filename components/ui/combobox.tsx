"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCanvasStore } from "@/store/useCanvasStore";

const fonts = [
  {
    value: "Arial",
    label: "Arial",
  },
  {
    value: "Helvetica",
    label: "Helvetica",
  },
  {
    value: "Times New Roman",
    label: "Times New Roman",
  },
  {
    value: "Courier New",
    label: "Courier New",
  },
  {
    value: "Georgia",
    label: "Georgia",
  },
  {
    value: "Verdana",
    label: "Verdana",
  },
  {
    value: "Trebuchet MS",
    label: "Trebuchet MS",
  },
  {
    value: "Impact",
    label: "Impact",
  },
  {
    value: "Comic Sans MS",
    label: "Comic Sans MS",
  },
  {
    value: "Tahoma",
    label: "Tahoma",
  },
];

export default function Combobox() {
  const canvas = useCanvasStore((state: any) => state.canvas);
  const activeObject = canvas?.getActiveObject();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(activeObject?.fontFamily || "");
  React.useEffect(() => {
    activeObject?.set({ fontFamily: value });
    canvas.renderAll();
  }, [value, activeObject, canvas]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? fonts.find((font) => font.value === value)?.label
            : "Select fonts..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search fonts..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {fonts.map((font) => (
                <CommandItem
                  key={font.value}
                  value={font.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === font.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {font.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
