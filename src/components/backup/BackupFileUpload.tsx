
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Props {
  onFileParsed: (data: any[], file: File, type: "json" | "csv") => void;
}

function parseCSV(text: string): any[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line =>
    Object.fromEntries(
      line.split(",").map((v, i) => [headers[i], v.trim()])
    )
  );
}

export const BackupFileUpload: React.FC<Props> = ({ onFileParsed }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json") && !file.name.endsWith(".csv")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .json or .csv file.",
        variant: "destructive",
      });
      return;
    }

    const type = file.name.endsWith(".csv") ? "csv" : "json";
    const reader = new FileReader();

    reader.onload = (ev) => {
      try {
        let data: any[] = [];
        if (type === "json") {
          data = JSON.parse(ev.target?.result as string);
          if (!Array.isArray(data)) throw new Error("JSON must be an array of records");
        } else {
          data = parseCSV(ev.target?.result as string);
        }
        if (!data.length) throw new Error("No data found in file");
        onFileParsed(data, file, type);
        toast({
          title: "File uploaded",
          description: `${file.name} loaded with ${data.length} records.`,
        });
      } catch (err: any) {
        toast({
          title: "Failed to parse file",
          description: err.message,
          variant: "destructive"
        });
      }
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <Input
        type="file"
        accept=".json,.csv"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Choose Backup File (.json/.csv)
      </Button>
    </div>
  );
};
