
import { generatePDF } from './print/pdfGenerator';
import { printDocument } from './print/printManager';
import { formatDate } from './print/formatters';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const downloadIdCard = async (request: any) => {
  const idCardElement = document.querySelector('.id-card') as HTMLElement;
  if (!idCardElement) {
    throw new Error("Could not find ID card element");
  }
  
  try {
    // Generate the PDF
    await generatePDF(idCardElement, `employee-id-${request.employee_id || request.id}.pdf`);
    
    // Update database status if needed
    if (request.status === "approved") {
      await supabase
        .from('employee_registrations')
        .update({ 
          status: "id_generated",
          generated_at: new Date().toISOString()
        })
        .eq('id', request.id);
    }
  } catch (error) {
    console.error('Error downloading ID card:', error);
    throw error;
  }
};

export const printIdCard = async (request: any) => {
  try {
    // Print the card
    await printDocument(request);
    
    // Update database status
    if (request.status === "approved" || request.status === "id_generated") {
      await supabase
        .from('employee_registrations')
        .update({ 
          status: "id_printed",
          printed: true,
          printed_at: new Date().toISOString()
        })
        .eq('id', request.id);
        
      toast.success('ID Card printed successfully');
    }
  } catch (error) {
    console.error('Error printing ID card:', error);
    toast.error('Failed to print ID card');
    throw error;
  }
};

export const markAsCollected = async (request: any, collectorName: string) => {
  if (!collectorName.trim()) {
    toast.error("Collector name is required");
    return;
  }
  
  try {
    await supabase
      .from('employee_registrations')
      .update({ 
        status: "id_collected",
        collected_at: new Date().toISOString(),
        collector_name: collectorName
      })
      .eq('id', request.id);
      
    toast.success('ID Card marked as collected');
    return true;
  } catch (error) {
    console.error('Error marking ID card as collected:', error);
    toast.error('Failed to mark ID card as collected');
    return false;
  }
};

export { formatDate };
