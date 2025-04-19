
import { Button } from "@/components/ui/button";
import { Download, Printer, ArrowLeft, Info } from "lucide-react";
import { downloadIdCard, printIdCard } from "@/utils/idCardUtils";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

interface PrintControlsProps {
  request: any;
  onPrintComplete?: () => void;
}

const PrintControls = ({ request, onPrintComplete }: PrintControlsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePrint = async () => {
    try {
      // Print the ID card
      await printIdCard(request);

      // Update print status in Supabase if user is authenticated
      if (user) {
        const { error } = await supabase
          .from('employee_registrations')
          .update({ 
            printed: true, 
            printed_at: new Date().toISOString() 
          })
          .eq('id', request.id)
          .eq('user_id', user.id);

        if (error) throw error;

        toast.success('ID Card Printed Successfully');
        
        // Call the optional callback to refresh the UI
        onPrintComplete?.();
      }
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Failed to print ID card');
    }
  };

  const handleDownload = () => {
    downloadIdCard(request);
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Print Options</h2>
      
      <div className="space-y-3">
        <Button 
          onClick={handlePrint} 
          className="w-full"
          disabled={request.printed}
        >
          <Printer className="mr-2 h-4 w-4" />
          {request.printed ? 'Already Printed' : 'Print ID Card'}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleDownload}
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          Download as PDF
        </Button>

        <Button
          variant="secondary"
          onClick={handleGoBack}
          className="w-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {request.printed && (
          <div className="mt-4">
            <Badge variant="default" className="bg-green-500">
              <Info className="mr-2 h-4 w-4" />
              Printed on {new Date(request.printed_at).toLocaleString()}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintControls;
