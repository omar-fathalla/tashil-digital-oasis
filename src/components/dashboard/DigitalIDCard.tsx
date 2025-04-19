
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Printer, Download } from "lucide-react";
import { useApprovedRequests } from "@/hooks/useApprovedRequests";
import DigitalIDEntry from "./DigitalIDEntry";
import { Link } from "react-router-dom";

const DigitalIDCard = () => {
  const { data: approvedRequests, isLoading } = useApprovedRequests();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Digital ID Management
        </CardTitle>
        <Link to="/print-batch">
          <Button variant="outline" size="sm" className="h-8">
            <Printer className="h-4 w-4 mr-2" />
            Batch Printing
          </Button>
        </Link>
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
              <div className="flex justify-end pt-2">
                <Link to="/print-batch">
                  <Button variant="default" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Manage All ID Cards
                  </Button>
                </Link>
              </div>
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
