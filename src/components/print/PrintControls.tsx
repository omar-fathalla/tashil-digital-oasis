
import { Button } from "@/components/ui/button";
import { Download, Printer, ArrowLeft, Info, Settings } from "lucide-react";
import { downloadIdCard, printIdCard } from "@/utils/idCardUtils";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PrintControlsProps {
  request: any;
}

const PrintControls = ({ request }: PrintControlsProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Print Options</h2>
      
      <div className="space-y-3">
        <Button
          onClick={() => printIdCard(request)}
          className="w-full"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print ID Card
        </Button>
        
        <Button
          variant="outline"
          onClick={() => downloadIdCard(request)}
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
      </div>

      <Alert variant="default" className="bg-muted/50 mt-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Print Guidelines</AlertTitle>
        <AlertDescription>
          For best results, please follow these printing instructions.
        </AlertDescription>
      </Alert>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="print-settings">
          <AccordionTrigger className="text-sm">
            <Settings className="h-4 w-4 mr-2" /> Printer Settings
          </AccordionTrigger>
          <AccordionContent>
            <ul className="text-sm text-muted-foreground space-y-2 ml-6 list-disc">
              <li>Set paper size to A4</li>
              <li>Set orientation to Portrait</li>
              <li>Disable headers and footers</li>
              <li>Set margins to minimum or none</li>
              <li>Set scale to 100%</li>
              <li>Enable background graphics</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="card-info">
          <AccordionTrigger className="text-sm">
            <Info className="h-4 w-4 mr-2" /> Card Information
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Card Size: 5cm × 2.5cm</p>
              <p>Format: Credit card size</p>
              <p>ID Card contains:
                <ul className="ml-6 list-disc">
                  <li>Employee name</li>
                  <li>Employee ID</li>
                  <li>Company name</li>
                  <li>Issue date</li>
                  <li>QR code for verification</li>
                </ul>
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PrintControls;
