
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileCsv, Printer, Download } from "lucide-react";

type ExportOptionsProps = {
  onExport: (format: "csv" | "excel") => void;
  onPrint: () => void;
};

export const ExportOptions = ({ onExport, onPrint }: ExportOptionsProps) => {
  return (
    <div className="flex gap-2 mb-6">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => onExport("csv")}
      >
        <FileCsv className="h-4 w-4" />
        Export CSV
      </Button>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => onExport("excel")}
      >
        <FileSpreadsheet className="h-4 w-4" />
        Export Excel
      </Button>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={onPrint}
      >
        <Printer className="h-4 w-4" />
        Print Report
      </Button>
    </div>
  );
};
