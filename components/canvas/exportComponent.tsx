import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Download } from "lucide-react";
import { useCanvasStore } from "@/store/useCanvasStore";

import jsPDF from "jspdf";

export default function ExportCanvas() {
  const canvas = useCanvasStore((state: any) => state.canvas);

  const [format, setFormat] = useState<string | null>(null);
  const [resolution, setResolution] = useState<string | null>("hd");
  const [includeBackground, setIncludeBackground] = useState(false);

  const [loading, setLoading] = useState(false);
  const handleExport = async () => {
    if (!canvas) {
      alert("Canvas is not initialized!");
      return;
    }

    if (!format) {
      alert("Please select a file format!");
      return;
    }
    setLoading(true);

    try {
      const multiplier = resolutionMultiplier(resolution);
      let dataUrl;

      if (!includeBackground) {
        const originalBackground = canvas.backgroundColor;
        canvas.setBackgroundColor(null);
        canvas.renderAll();
        dataUrl = await canvas.toDataURL({
          format: format === "pdf" ? "png" : format.toLowerCase(),
          multiplier,
        });
        canvas.setBackgroundColor(originalBackground);
        canvas.renderAll();
      } else {
        dataUrl = await canvas.toDataURL({
          format: format === "pdf" ? "png" : format.toLowerCase(),
          multiplier,
        });
      }

      if (format === "pdf") {
        const pdf = new jsPDF("landscape");
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("canvas.pdf");
      } else {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `canvas.${format.toLowerCase()}`;
        link.click();
      }
    } catch (error) {
      console.error("Error exporting canvas:", error);
    } finally {
      setLoading(false);
    }
  };

  const resolutionMultiplier = (res: string | null) => {
    switch (res) {
      case "hd":
        return 1;
      case "fhd":
        return 2;
      case "2k":
        return 3;
      case "4k":
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="w-56">
      <h3 className="text-sm font-semibold mb-2">Export</h3>
      <Dialog>
        <DialogTrigger>
          <Button
            variant="secondary"
            className="w-52 flex items-center justify-between"
          >
            <Download className="mr-2" /> Export
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[420px] p-6 bg-gray-50 rounded-lg dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="mb-2 text-lg font-bold text-gray-800 text-center dark:text-gray-50">
              Export Canvas
            </DialogTitle>
            <p className="text-sm text-gray-600 text-center">
              Customize export settings before downloading.
            </p>
          </DialogHeader>

          <div className="flex gap-6 mt-4">
            <div className="flex-1">
              <label
                htmlFor="file-format"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                File Format
              </label>
              <Select onValueChange={(value) => setFormat(value)}>
                <SelectTrigger id="file-format" className="w-full">
                  <SelectValue placeholder="Select Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="webP">WebP</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label
                htmlFor="file-resolution"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Resolution
              </label>
              <Select onValueChange={(value) => setResolution(value)}>
                <SelectTrigger id="file-resolution" className="w-full">
                  <SelectValue placeholder="Select Resolution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hd">HD</SelectItem>
                  <SelectItem value="fhd">FHD</SelectItem>
                  <SelectItem value="2k">2K</SelectItem>
                  <SelectItem value="4k">4K</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <Switch
              id="background-toggle"
              onCheckedChange={setIncludeBackground}
            />
            <label
              htmlFor="background-toggle"
              className="text-sm font-medium text-gray-700"
            >
              Include Background
            </label>
          </div>

          <div className="mt-6">
            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={() => handleExport()}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Download />}
              <span>{loading ? "Exporting..." : "Export Canvas"}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
