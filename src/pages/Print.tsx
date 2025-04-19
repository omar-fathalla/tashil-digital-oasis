
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import IDCardPreview from "@/components/print/IDCardPreview";
import PrintControls from "@/components/print/PrintControls";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";

const Print = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPrinted, setIsPrinted] = useState(false);

  // If no user is logged in, redirect to auth
  if (!user) {
    navigate("/auth");
    return null;
  }

  const { data: request, isLoading, refetch } = useQuery({
    queryKey: ['print-request', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('employee_registrations')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only access their own requests
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user
  });

  const handlePrintComplete = () => {
    setIsPrinted(true);
    refetch(); // Refresh the data to get updated print status
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <Card className="max-w-3xl mx-auto p-6 my-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">ID Card Preview</h2>
          <p>No employee data found. Please submit a registration request first.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Employee ID Card</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="id-card-container">
              <IDCardPreview request={request} />
            </div>
          </div>
          
          <div>
            <Separator className="md:hidden mb-6" />
            <PrintControls 
              request={request} 
              onPrintComplete={handlePrintComplete} 
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Print;
