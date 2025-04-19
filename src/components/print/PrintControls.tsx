
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { downloadIdCard, printIdCard } from "@/utils/idCardUtils";

interface PrintControlsProps {
  request: any;
}

const PrintControls = ({ request }: PrintControlsProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Print Options</h2>
      
      <div className="grid gap-4">
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
      </div>

      <div className="mt-8">
        <h3 className="font-medium mb-2">Print Guidelines</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Set paper size to A4</li>
          <li>• Disable margins in print settings</li>
          <li>• Set scale to 100%</li>
          <li>• Enable background graphics</li>
        </ul>
      </div>
    </div>
  );
};

export default PrintControls;
