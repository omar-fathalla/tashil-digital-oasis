
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

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
  const [useSampleData, setUseSampleData] = useState(false);

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
      
      // Check if we need to use sample data
      if (!data || data.length === 0) {
        setUseSampleData(true);
        return generateSampleActivity();
      }
      
      // Transform the data to add document_name from the joined table
      const transformedData = data.map(item => ({
        ...item,
        document_name: item.documents?.name || 'Unknown Document'
      }));
      
      return transformedData as DocumentActivity[];
    } catch (error) {
      console.error("Error fetching document activity:", error);
      setUseSampleData(true);
      return generateSampleActivity();
    }
  };

  const generateSampleActivity = (): DocumentActivity[] => {
    const actions = ['view', 'download', 'edit', 'upload', 'delete', 'share', 'rename', 'new_version'];
    const documentNames = [
      'Employee Handbook', 'Privacy Policy', 'Company Bylaws', 
      'Annual Report', 'Financial Statement', 'Project Proposal',
      'Marketing Strategy', 'Customer Analysis', 'Technical Documentation'
    ];
    
    const sampleActivity: DocumentActivity[] = [];
    
    // Generate 20 sample activities
    for (let i = 0; i < 20; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 10)); // Last 10 days
      date.setHours(date.getHours() - Math.floor(Math.random() * 24)); // Random hour of the day
      
      const documentId = `sample-doc-${Math.floor(Math.random() * documentNames.length)}`;
      const documentName = documentNames[Math.floor(Math.random() * documentNames.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      sampleActivity.push({
        id: `sample-activity-${i}`,
        document_id: documentId,
        document_name: documentName,
        user_id: 'sample-user',
        user_name: `User ${Math.floor(Math.random() * 5) + 1}`,
        action,
        timestamp: date.toISOString(),
        ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
        details: action === 'edit' ? { changedFields: ['name', 'description'] } : undefined
      });
    }
    
    return sampleActivity.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
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
    refetch,
    useSampleData
  };
};
