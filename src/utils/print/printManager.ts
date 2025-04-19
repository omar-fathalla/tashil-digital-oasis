
import { toast } from "sonner";
import { generateIdCardHTML } from "./htmlGenerator";

export const printDocument = (request: any): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    try {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Unable to open print window. Please check your popup settings.");
        reject(new Error("Popup blocked"));
        return;
      }
      
      // Write the ID card HTML to the print window
      printWindow.document.write(generateIdCardHTML(request));
      printWindow.document.close();
      
      // Wait for content to load before printing
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          toast.success("Print job sent to printer");
          resolve();
        }, 500);
      };

      // Handle print completion or cancellation
      printWindow.onafterprint = () => {
        printWindow.close();
        resolve();
      };

      // Handle print errors
      printWindow.onerror = (error) => {
        console.error("Print error:", error);
        toast.error("Failed to print ID card");
        reject(error);
      };
    } catch (error) {
      console.error("Error printing ID card:", error);
      toast.error("Failed to print ID card");
      reject(error);
    }
  });
};
