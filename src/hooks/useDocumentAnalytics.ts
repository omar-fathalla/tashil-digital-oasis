
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Document } from "@/utils/documentApi";
import { useToast } from "@/hooks/use-toast";

export interface DocumentStats {
  totalDocuments: number;
  totalSize: number;
  uploadedThisMonth: number;
  encryptedCount: number;
  categoryCounts: Record<string, number>;
  userActivitySummary: {
    userId: string;
    userName: string;
    uploadCount: number;
    lastActive: string;
  }[];
  mostAccessed?: Document[];
}

export const useDocumentAnalytics = () => {
  const { toast } = useToast();
  
  const fetchDocumentStats = async (): Promise<DocumentStats> => {
    try {
      // Get total documents count
      const { count: totalDocuments, error: countError } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true });
      
      if (countError) throw countError;
      
      // Get documents uploaded this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { count: uploadedThisMonth, error: monthCountError } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString());
        
      if (monthCountError) throw monthCountError;
      
      // Get documents by category
      const { data: categoryData, error: categoryError } = await supabase
        .from("documents")
        .select(`
          category_id,
          document_categories(name)
        `);
        
      if (categoryError) throw categoryError;
      
      // Calculate category counts
      const categoryCounts: Record<string, number> = {};
      categoryData?.forEach(doc => {
        const categoryName = doc.document_categories?.name || "Uncategorized";
        categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
      });
      
      // Get encrypted documents count
      const { count: encryptedCount, error: encryptedError } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .eq("is_encrypted", true);
        
      if (encryptedError) throw encryptedError;
      
      // Get total file size
      const { data: sizeData, error: sizeError } = await supabase
        .from("documents")
        .select("file_size");
        
      if (sizeError) throw sizeError;
      
      const totalSize = sizeData?.reduce((sum, doc) => sum + (doc.file_size || 0), 0) || 0;
      
      // Get user activity summary
      const { data: userActivity, error: userError } = await supabase
        .from("documents")
        .select(`
          uploaded_by,
          created_at
        `);
        
      if (userError) throw userError;
      
      const userMap: Record<string, { count: number, lastActive: string }> = {};
      userActivity?.forEach(doc => {
        if (!doc.uploaded_by) return;
        
        if (!userMap[doc.uploaded_by]) {
          userMap[doc.uploaded_by] = {
            count: 1,
            lastActive: doc.created_at
          };
        } else {
          userMap[doc.uploaded_by].count += 1;
          if (new Date(doc.created_at) > new Date(userMap[doc.uploaded_by].lastActive)) {
            userMap[doc.uploaded_by].lastActive = doc.created_at;
          }
        }
      });
      
      const userActivitySummary = Object.entries(userMap).map(([userId, data]) => ({
        userId,
        userName: userId, // Ideally we'd fetch user names, but that's a separate API call
        uploadCount: data.count,
        lastActive: data.lastActive
      }));
      
      // Get most accessed documents
      const { data: accessLogs, error: logsError } = await supabase
        .from("document_access_logs")
        .select(`
          document_id,
          count
        `)
        .order("count", { ascending: false })
        .limit(5);
        
      // If we can't get logs, just continue without this data
      let mostAccessed: Document[] = [];
      if (!logsError && accessLogs?.length) {
        const docIds = accessLogs.map(log => log.document_id);
        const { data: docs } = await supabase
          .from("documents")
          .select("*")
          .in("id", docIds);
          
        mostAccessed = docs as Document[] || [];
      }
      
      return {
        totalDocuments: totalDocuments || 0,
        uploadedThisMonth: uploadedThisMonth || 0,
        totalSize,
        encryptedCount: encryptedCount || 0,
        categoryCounts,
        userActivitySummary,
        mostAccessed
      };
    } catch (error) {
      console.error("Error fetching document statistics:", error);
      toast({
        title: "Error",
        description: "Failed to load document statistics",
        variant: "destructive",
      });
      
      // Return default values on error
      return {
        totalDocuments: 0,
        uploadedThisMonth: 0,
        totalSize: 0,
        encryptedCount: 0,
        categoryCounts: {},
        userActivitySummary: []
      };
    }
  };
  
  const { 
    data: documentStats,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refreshStats
  } = useQuery({
    queryKey: ["document-statistics"],
    queryFn: fetchDocumentStats,
  });
  
  return {
    documentStats,
    isLoadingStats,
    statsError,
    refreshStats
  };
};
