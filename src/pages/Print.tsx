
import { Card } from "@/components/ui/card";
import IDCardPreview from "@/components/print/IDCardPreview";
import PrintControls from "@/components/print/PrintControls";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Print = () => {
  const { id } = useParams();

  const { data: request, isLoading } = useQuery({
    queryKey: ['print-request', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('registration_requests')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!request) {
    return <div>Request not found</div>;
  }

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <IDCardPreview request={request} />
        </div>
        <div>
          <PrintControls request={request} />
        </div>
      </div>
    </Card>
  );
};

export default Print;
