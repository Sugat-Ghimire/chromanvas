import {
  Dialog,
  DialogContent,
  DialogDescription,
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
export default function ExportCanvas() {
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
              <Select>
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
              <Select>
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
            <Switch id="background-toggle" />
            <label
              htmlFor="background-toggle"
              className="text-sm font-medium text-gray-700"
            >
              Include Background
            </label>
          </div>

          <div className="mt-6">
            <Button className="w-full flex items-center justify-center gap-2">
              {/* <ChevronDown /> */}
              <Download />
              <span>Export Canvas</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
