
import { Button } from "@/components/ui/button";
import { Download, Printer, ArrowLeft, Info, Check, User } from "lucide-react";
import { downloadIdCard, printIdCard } from "@/utils/idCardUtils";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PrintControlsProps {
  request: any;
  onPrintComplete?: () => void;
}

const PrintControls = ({ request, onPrintComplete }: PrintControlsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCollectDialogOpen, setIsCollectDialogOpen] = useState(false);
  const [collectorName, setCollectorName] = useState("");

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
            printed_at: new Date().toISOString(),
            status: "id_printed"
          })
          .eq('id', request.id);

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

  const handleMarkAsCollected = async () => {
    if (!collectorName.trim()) {
      toast.error("Please enter the collector's name");
      return;
    }

    try {
      const { error } = await supabase
        .from('employee_registrations')
        .update({ 
          status: "id_collected",
          collected_at: new Date().toISOString(),
          collector_name: collectorName
        })
        .eq('id', request.id);

      if (error) throw error;

      toast.success('ID Card marked as collected');
      setIsCollectDialogOpen(false);
      onPrintComplete?.();
    } catch (error) {
      console.error('Error marking as collected:', error);
      toast.error('Failed to update collection status');
    }
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
          disabled={request.status === "id_printed" || request.status === "id_collected"}
        >
          <Printer className="mr-2 h-4 w-4" />
          {request.status === "id_printed" || request.status === "id_collected" ? 'Already Printed' : 'Print ID Card'}
        </Button>
        
        <Button
          variant="outline"
          onClick={handleDownload}
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          Download as PDF
        </Button>

        {request.printed && request.status !== "id_collected" && (
          <Button
            variant="outline"
            onClick={() => setIsCollectDialogOpen(true)}
            className="w-full"
          >
            <Check className="mr-2 h-4 w-4" />
            Mark as Collected
          </Button>
        )}

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
        
        {request.status === "id_collected" && (
          <div className="mt-2">
            <Badge variant="default" className="bg-blue-500">
              <User className="mr-2 h-4 w-4" />
              Collected by {request.collector_name} on {new Date(request.collected_at).toLocaleString()}
            </Badge>
          </div>
        )}
      </div>
      
      <Dialog open={isCollectDialogOpen} onOpenChange={setIsCollectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark ID Card as Collected</DialogTitle>
            <DialogDescription>
              Enter the name of the person collecting this ID card
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="collector-name">Collector's Name</Label>
              <Input
                id="collector-name"
                placeholder="Enter collector's full name"
                value={collectorName}
                onChange={(e) => setCollectorName(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCollectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkAsCollected}>
              Confirm Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrintControls;
