
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from "sonner";

export const generatePDF = async (element: HTMLElement, fileName: string): Promise<void> => {
  try {
    toast.info("Preparing ID card for download...");
    
    // Create a PDF document with proper dimensions
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'cm',
      format: [7, 5] // slightly larger to ensure margins
    });
    
    // Convert the element to canvas
    const canvas = await html2canvas(element, {
      scale: 5, // Higher scale for better quality
      backgroundColor: "#ffffff",
      logging: false
    });
    
    // Add the image to the PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 1, 1, 5, 2.5); // 5cm x 2.5cm with 1cm margins
    
    // Save the PDF
    pdf.save(fileName);
    toast.success("ID Card downloaded successfully");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF");
    throw error;
  }
};
