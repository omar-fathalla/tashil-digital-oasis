
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDigitalIDCards } from "@/hooks/useDigitalIDCards";
import { Printer, Download, Search, Check, User } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ensureDemoData } from "@/utils/seedDemoData";

const IDCardManager = () => {
  const { idCards, isLoading: isLoadingCards } = useDigitalIDCards();
  const [searchQuery, setSearchQuery] = useState("");
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

  const isLoading = isLoadingCards || isLoadingDemoData;

  const filteredCards = idCards?.filter((card) => 
    card.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string, item: any) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending ID Generation
          </Badge>
        );
      case "id_generated":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            ID Generated
          </Badge>
        );
      case "id_printed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" /> Printed
          </Badge>
        );
      case "id_collected":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            <User className="h-3 w-3 mr-1" /> Collected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Digital ID Management
          </div>
          <Link to="/print-batch">
            <Button size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Batch Print
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name or ID..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading ID cards...</div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>ID Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCards && filteredCards.length > 0 ? (
                  filteredCards.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell className="font-medium">{card.full_name}</TableCell>
                      <TableCell className="font-mono text-sm">{card.employee_id}</TableCell>
                      <TableCell>{getStatusBadge(card.status, card)}</TableCell>
                      <TableCell>
                        {card.printed_at 
                          ? format(new Date(card.printed_at), "PPP") 
                          : card.submission_date 
                            ? format(new Date(card.submission_date), "PPP")
                            : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/print/${card.id}`}>
                            <Button variant="ghost" size="sm">
                              <Printer className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              toast.info("Downloading ID card...");
                              // In a real implementation, this would download the ID card
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No ID cards found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IDCardManager;
