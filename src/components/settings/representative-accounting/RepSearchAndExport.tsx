
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, FileJson, FileCsv } from "lucide-react";
import { RepWithCompany } from "./types";

type RepSearchAndExportProps = {
  onSearch: (value: string) => void;
  data: RepWithCompany[];
};

export const RepSearchAndExport = ({ onSearch, data }: RepSearchAndExportProps) => {
  const exportData = (format: "csv" | "json") => {
    const exportableData = data.map((rep) => ({
      full_name: rep.full_name,
      type: rep.type,
      company_name: rep.company_name,
      value: rep.value,
      created_at: rep.created_at,
    }));

    if (format === "json") {
      const jsonString = JSON.stringify(exportableData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "representatives.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const headers = ["Full Name", "Type", "Company", "Value", "Created At"];
      const csvData = exportableData.map((rep) =>
        [
          rep.full_name,
          rep.type,
          rep.company_name,
          rep.value,
          new Date(rep.created_at).toLocaleDateString(),
        ].join(",")
      );
      const csvContent = [headers.join(","), ...csvData].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "representatives.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:w-96">
        <Input
          placeholder="Search by name or company..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => exportData("csv")}>
          <FileCsv className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
        <Button variant="outline" onClick={() => exportData("json")}>
          <FileJson className="mr-2 h-4 w-4" />
          Export JSON
        </Button>
      </div>
    </div>
  );
};
