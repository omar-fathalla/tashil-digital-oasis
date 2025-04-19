
import { User, Building, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { downloadIdCard, printIdCard } from "@/utils/idCardUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDate } from "@/utils/print/formatters";

interface PrintableIDCardProps {
  employee: any;
}

const PrintableIDCard = ({ employee }: PrintableIDCardProps) => {
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
        <Card className="relative bg-white overflow-hidden shadow-xl print:shadow-none p-4"
          style={{
            width: "5cm",
            height: "2.5cm",
            maxWidth: "100%"
          }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b pb-1 mb-1">
              <div className="flex items-center">
                <img
                  src="/placeholder.svg"
                  alt="Company Logo"
                  className="h-6 w-6 mr-1"
                />
                <span className="font-bold text-xs">{employee.company_name}</span>
              </div>
              <div className="text-right">
                <p className="text-[8px] text-muted-foreground">ID: {employee.employee_id}</p>
              </div>
            </div>
            
            <div className="flex items-center mb-1">
              <div className="bg-muted rounded-full p-1 mr-2">
                <User className="h-3 w-3" />
              </div>
              <div>
                <h3 className="font-semibold text-xs line-clamp-1">{employee.full_name}</h3>
                <p className="text-[8px] text-muted-foreground">
                  <Calendar className="h-2 w-2 inline mr-1" />
                  {formatDate(employee.submission_date)}
                </p>
              </div>
            </div>
            
            <div className="mt-auto flex items-center justify-between text-[8px] text-muted-foreground">
              <div>
                <Building className="h-2 w-2 inline mr-1" />
                {employee.company_name}
              </div>
              <div className="grid place-items-center w-5 h-5 bg-muted rounded">
                QR
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PrintableIDCard;
