
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDocumentAnalytics } from "@/hooks/useDocumentAnalytics";
import { useDocumentActivity } from "@/hooks/useDocumentActivity";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ExportReportButtonProps {
  reportType: 'excel' | 'pdf';
  children?: React.ReactNode;
}

export const ExportReportButton = ({ reportType, children }: ExportReportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const { documentStats } = useDocumentAnalytics();
  const { activity } = useDocumentActivity();
  
  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const timestamp = format(new Date(), 'yyyy-MM-dd-HHmm');
      const filename = `document-activity-report-${timestamp}`;
      
      if (reportType === 'excel') {
        await exportToExcel(filename);
      } else {
        exportToPdf(filename);
      }
      
      toast({
        title: "Report exported",
        description: `Your report has been ${reportType === 'excel' ? 'downloaded' : 'generated'} successfully`,
      });
    } catch (error) {
      console.error("Error exporting report:", error);
      toast({
        title: "Export failed",
        description: "There was an error generating your report",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const exportToExcel = async (filename: string) => {
    // Create workbook and worksheets
    const wb = XLSX.utils.book_new();
    
    // Summary worksheet
    const summaryData = [
      ["Document Management System - Activity Report"],
      ["Generated On", format(new Date(), 'PPPp')],
      [""],
      ["Statistics Summary"],
      ["Total Documents", documentStats?.totalDocuments || 0],
      ["Uploaded This Month", documentStats?.uploadedThisMonth || 0],
      ["Encrypted Documents", documentStats?.encryptedCount || 0],
      ["Total Storage Used", `${((documentStats?.totalSize || 0) / (1024 * 1024)).toFixed(2)} MB`],
      [""],
      ["Document Categories"],
      ...Object.entries(documentStats?.categoryCounts || {}).map(([category, count]) => [category, count]),
    ];
    
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");
    
    // Activity worksheet
    const activityHeaders = ["Document", "Action", "User", "Timestamp", "IP Address"];
    const activityData = activity.map(item => [
      item.document_name,
      item.action,
      item.user_name || item.user_id,
      format(new Date(item.timestamp), 'PPPp'),
      item.ip_address || 'N/A'
    ]);
    
    const activityWs = XLSX.utils.aoa_to_sheet([activityHeaders, ...activityData]);
    XLSX.utils.book_append_sheet(wb, activityWs, "Activity Log");
    
    // Write and save file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${filename}.xlsx`);
  };
  
  const exportToPdf = (filename: string) => {
    // @ts-ignore - jsPDF has issues with TypeScript
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text("Document Management System - Activity Report", 15, 15);
    
    // Generated date
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), 'PPPp')}`, 15, 25);
    
    // Summary section
    doc.setFontSize(14);
    doc.text("Statistics Summary", 15, 35);
    
    // @ts-ignore - jsPDF-autotable types
    doc.autoTable({
      startY: 40,
      head: [["Metric", "Value"]],
      body: [
        ["Total Documents", documentStats?.totalDocuments?.toString() || "0"],
        ["Uploaded This Month", documentStats?.uploadedThisMonth?.toString() || "0"],
        ["Encrypted Documents", documentStats?.encryptedCount?.toString() || "0"],
        ["Total Storage Used", `${((documentStats?.totalSize || 0) / (1024 * 1024)).toFixed(2)} MB`]
      ],
    });
    
    // Categories section
    const lastY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("Document Categories", 15, lastY);
    
    const categories = Object.entries(documentStats?.categoryCounts || {}).map(
      ([category, count]) => [category, count.toString()]
    );
    
    // @ts-ignore - jsPDF-autotable types
    doc.autoTable({
      startY: lastY + 5,
      head: [["Category", "Count"]],
      body: categories,
    });
    
    // Activity log section
    const newY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("Recent Activity", 15, newY);
    
    const activityData = activity.slice(0, 20).map(item => [
      item.document_name,
      item.action,
      item.user_name || item.user_id.substring(0, 8),
      format(new Date(item.timestamp), 'MMM d, yyyy')
    ]);
    
    // @ts-ignore - jsPDF-autotable types
    doc.autoTable({
      startY: newY + 5,
      head: [["Document", "Action", "User", "Date"]],
      body: activityData,
    });
    
    // Save the PDF
    doc.save(`${filename}.pdf`);
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {children || (reportType === 'excel' ? 'Export to Excel' : 'Export to PDF')}
      {isExporting && <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
    </Button>
  );
};
