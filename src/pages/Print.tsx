
import { Card } from "@/components/ui/card";
import IDCardPreview from "@/components/print/IDCardPreview";
import PrintControls from "@/components/print/PrintControls";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PrintProps {
  request?: any;
}

const Print = ({ request: propRequest }: PrintProps) => {
  const { id } = useParams();
  const queryId = id || null;

  const { data: fetchedRequest, isLoading } = useQuery({
    queryKey: ['print-request', queryId],
    queryFn: async () => {
      if (!queryId) return null;
      
      const { data, error } = await supabase
        .from('registration_requests')
        .select('*')
        .eq('id', queryId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!queryId && !propRequest
  });

  const request = propRequest || fetchedRequest;
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!request) {
    return <div>Request not found</div>;
  }

  return (
    <>
      <div>
        <IDCardPreview request={request} />
      </div>
      <div>
        <PrintControls request={request} />
      </div>
    </>
  );
};

export default Print;
