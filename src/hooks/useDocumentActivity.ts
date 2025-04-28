
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DocumentActivity {
  id: string;
  document_id: string;
  document_name?: string;
  user_id: string;
  user_name?: string;
  action: string;
  timestamp: string;
  ip_address?: string;
  details?: any;
}

export interface DocumentActivityFilters {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  documentId?: string;
  action?: string;
}

export const useDocumentActivity = (filters: DocumentActivityFilters = {}) => {
  const fetchDocumentActivity = async (): Promise<DocumentActivity[]> => {
    try {
      let query = supabase
        .from("document_access_logs")
        .select(`
          id,
          document_id,
          user_id,
          action,
          timestamp,
          ip_address,
          details,
          documents!inner(name)
        `);

      // Apply filters
      if (filters.startDate) {
        query = query.gte('timestamp', filters.startDate.toISOString());
      }
      
      if (filters.endDate) {
        query = query.lte('timestamp', filters.endDate.toISOString());
      }
      
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      
      if (filters.documentId) {
        query = query.eq('document_id', filters.documentId);
      }
      
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      
      // Get the latest activity first
      query = query.order('timestamp', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data to add document_name from the joined table
      const transformedData = data.map(item => ({
        ...item,
        document_name: item.documents?.name || 'Unknown Document'
      }));
      
      return transformedData as DocumentActivity[];
    } catch (error) {
      console.error("Error fetching document activity:", error);
      return [];
    }
  };

  const { 
    data: activity = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["document-activity", filters],
    queryFn: fetchDocumentActivity,
  });

  return {
    activity,
    isLoading,
    error,
    refetch
  };
};
