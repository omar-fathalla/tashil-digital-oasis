
import { useState } from "react";
import { Card } from "@/components/ui/card";
import IDCardPreview from "@/components/print/IDCardPreview";
import PrintControls from "@/components/print/PrintControls";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/print/formatters";
import { Badge } from "@/components/ui/badge";
import { Check, X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Print = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // If no user is logged in, redirect to auth
  if (!user) {
    navigate("/auth");
    return null;
  }

  const { data: requests, isLoading } = useQuery({
    queryKey: ['employee-registrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employee_registrations')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <Card className="max-w-3xl mx-auto p-6 my-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">ID Card Preview</h2>
          <p>No employee registrations found. Please submit a registration request first.</p>
        </div>
      </Card>
    );
  }

  // Default to first request if no selection
  const currentRequest = selectedRequest || requests[0];

  const handleSelectEmployee = (request: any) => {
    setSelectedRequest(request);
  };

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Employee ID Cards</h1>
      
      <div className="mb-8">
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Registered Date</TableHead>
                <TableHead>Print Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow 
                  key={request.id}
                  className={selectedRequest?.id === request.id ? "bg-muted/50" : ""}
                >
                  <TableCell>{request.full_name}</TableCell>
                  <TableCell>{request.employee_id}</TableCell>
                  <TableCell>{request.company_name}</TableCell>
                  <TableCell>{formatDate(request.submission_date)}</TableCell>
                  <TableCell>
                    {request.printed ? (
                      <Badge className="bg-green-500">
                        <Check className="w-3 h-3 mr-1" />
                        Printed
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <X className="w-3 h-3 mr-1" />
                        Not Printed
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectEmployee(request)}
                    >
                      <Printer className="w-4 h-4 mr-1" />
                      Preview & Print
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {selectedRequest && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6 text-center">ID Card Preview</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <div className="id-card-container">
                <IDCardPreview request={selectedRequest} />
              </div>
            </div>
            <div>
              <Separator className="md:hidden mb-6" />
              <PrintControls request={selectedRequest} />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Print;
