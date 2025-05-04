
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Printer, Download } from "lucide-react";
import { useApprovedRequests } from "@/hooks/useApprovedRequests";
import { useDigitalIDCards } from "@/hooks/useDigitalIDCards";
import DigitalIDEntry from "./DigitalIDEntry";
import { Link } from "react-router-dom";
import RepresentativePreview from "../print/RepresentativePreview";
import { ensureDemoData } from "@/utils/seedDemoData";

const DigitalIDCard = () => {
  const { data: approvedRequests, isLoading: isLoadingRequests } = useApprovedRequests();
  const { idCards, isLoading: isLoadingCards } = useDigitalIDCards();
  const [isLoadingDemoData, setIsLoadingDemoData] = useState(false);

  // Ensure we have demo data when the component loads
  useEffect(() => {
    const loadDemoData = async () => {
      setIsLoadingDemoData(true);
      try {
        await ensureDemoData();
      } catch (error) {
        console.error("Failed to load demo data:", error);
      } finally {
        setIsLoadingDemoData(false);
      }
    };
    
    loadDemoData();
  }, []);

  const isLoading = isLoadingRequests || isLoadingCards || isLoadingDemoData;
  const displayCards = idCards?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
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
              <p>Loading employee data...</p>
            ) : displayCards.length > 0 ? (
              <div className="space-y-4">
                {displayCards.map((card) => (
                  <DigitalIDEntry key={card.id} request={card} />
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
              <p className="text-muted-foreground">No approved employees found.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Representative ID Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <RepresentativePreview />
        </CardContent>
      </Card>
    </div>
  );
};

export default DigitalIDCard;
