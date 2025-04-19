
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useApprovedRequests } from "@/hooks/useApprovedRequests";
import DigitalIDEntry from "./DigitalIDEntry";

const DigitalIDCard = () => {
  const { data: approvedRequests, isLoading } = useApprovedRequests();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Digital ID Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p>Loading approved requests...</p>
          ) : approvedRequests && approvedRequests.length > 0 ? (
            <div className="space-y-4">
              {approvedRequests.map((request: any) => (
                <DigitalIDEntry key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No approved requests found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DigitalIDCard;
