
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const ExportReportButton = () => {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export delay
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Report exported successfully", {
        description: "The document analytics report has been downloaded."
      });
    }, 1500);
  };
  
  return (
    <Button 
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2"
    >
      {isExporting ? (
        <>
          <span className="animate-spin">
            <Download className="h-4 w-4" />
          </span>
          Exporting...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Export Report
        </>
      )}
    </Button>
  );
};
