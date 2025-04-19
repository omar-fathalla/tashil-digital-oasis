
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import IDCardPreview from "@/components/print/IDCardPreview";
import PrintControls from "@/components/print/PrintControls";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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

  // If no requests, show a message
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

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Employee ID Card</h1>
        
        <div className="mb-4">
          <Select 
            value={currentRequest.id} 
            onValueChange={(id) => {
              const selected = requests.find((req: any) => req.id === id);
              setSelectedRequest(selected);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an employee" />
            </SelectTrigger>
            <SelectContent>
              {requests.map((request: any) => (
                <SelectItem key={request.id} value={request.id}>
                  {request.full_name} - {request.employee_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="id-card-container">
              <IDCardPreview request={currentRequest} />
            </div>
          </div>
          
          <div>
            <Separator className="md:hidden mb-6" />
            <PrintControls 
              request={currentRequest} 
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Print;
