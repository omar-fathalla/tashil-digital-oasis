
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { downloadIdCard, printIdCard } from "@/utils/idCardUtils";
import { Link } from "react-router-dom";

interface DigitalIDEntryProps {
  request: any;
}

const DigitalIDEntry = ({ request }: DigitalIDEntryProps) => {
  return (
    <div className="flex items-center justify-between border-b pb-2">
      <div>
        <p className="font-medium">{request.full_name}</p>
        <p className="text-sm text-muted-foreground">ID: {request.id_card?.id || 'Pending'}</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => downloadIdCard(request)}
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
        <Link to={`/print/${request.id}`}>
          <Button
            variant="outline"
            size="sm"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DigitalIDEntry;
