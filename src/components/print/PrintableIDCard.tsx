
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { downloadIdCard, printIdCard } from "@/utils/idCardUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDate } from "@/utils/print/formatters";

interface PrintableIDCardProps {
  employee: any;
  onPrintComplete?: () => void;
}

const PrintableIDCard = ({ employee, onPrintComplete }: PrintableIDCardProps) => {
  const handlePrint = async () => {
    try {
      await printIdCard(employee);
      
      const { error } = await supabase
        .from('employee_registrations')
        .update({ 
          printed: true, 
          printed_at: new Date().toISOString() 
        })
        .eq('id', employee.id);

      if (error) throw error;
      
      toast.success('ID Card printed successfully');
      onPrintComplete?.();
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to print ID card');
    }
  };

  const handleDownload = () => {
    downloadIdCard(employee);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">ID Card Preview</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleDownload}>
            Download PDF
          </Button>
          <Button onClick={handlePrint}>
            Print ID Card
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <Card 
          className="id-card relative bg-white overflow-hidden shadow-xl print:shadow-none p-6"
          style={{
            width: "2.5cm",
            height: "5cm",
            maxWidth: "100%"
          }}
        >
          <div className="flex flex-col items-center justify-between h-full text-center">
            <div className="w-full space-y-4">
              <div className="w-12 h-12 mx-auto bg-primary rounded-lg grid place-items-center">
                <span className="text-2xl font-bold text-white">T</span>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-bold text-lg">{employee.full_name}</h3>
                <p className="font-mono text-sm">{employee.employee_id}</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-xl font-bold">Tashil</h4>
                <p className="text-sm text-muted-foreground">
                  Registered: {formatDate(employee.submission_date)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="w-24 h-24 mx-auto">
                <img 
                  src="/lovable-uploads/40399485-5ff4-4aa6-b30f-c6eb664a8a39.png" 
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              
              {employee.printed && (
                <div className="flex items-center justify-center text-green-500 text-sm">
                  <Check className="w-4 h-4 mr-1" />
                  <span>Printed</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrintableIDCard;
