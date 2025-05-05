
import { useState, useEffect } from "react";

interface DocumentStats {
  totalCount: number;
  fileTypeBreakdown: Record<string, number>;
  categoryCounts: Record<string, number>;
  monthlyUploads: {
    month: string;
    count: number;
  }[];
}

export const useDocumentAnalytics = () => {
  const [documentStats, setDocumentStats] = useState<DocumentStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        // In a real app, this would be a call to the backend
        // For now, we'll generate some sample data
        const sampleStats = generateSampleStats();
        setDocumentStats(sampleStats);
      } catch (err) {
        console.error("Error fetching document statistics:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const generateSampleStats = (): DocumentStats => {
    // Generate sample file type breakdown
    const fileTypes = {
      "PDF": Math.floor(Math.random() * 50) + 20,
      "DOCX": Math.floor(Math.random() * 30) + 10,
      "XLSX": Math.floor(Math.random() * 20) + 5,
      "JPG": Math.floor(Math.random() * 15) + 8,
      "PNG": Math.floor(Math.random() * 10) + 5,
    };

    // Generate sample category counts
    const categories = {
      "Human Resources": Math.floor(Math.random() * 30) + 15,
      "Finance": Math.floor(Math.random() * 20) + 10,
      "Legal": Math.floor(Math.random() * 25) + 12,
      "Operations": Math.floor(Math.random() * 15) + 8,
      "Marketing": Math.floor(Math.random() * 10) + 5,
    };

    // Generate sample monthly uploads for the last 6 months
    const monthlyUploads = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate);
      month.setMonth(currentDate.getMonth() - i);
      
      monthlyUploads.push({
        month: month.toLocaleString('default', { month: 'short', year: 'numeric' }),
        count: Math.floor(Math.random() * 20) + 5,
      });
    }

    // Calculate total count
    const totalCount = Object.values(fileTypes).reduce((sum, count) => sum + count, 0);

    return {
      totalCount,
      fileTypeBreakdown: fileTypes,
      categoryCounts: categories,
      monthlyUploads,
    };
  };

  return {
    documentStats,
    isLoadingStats,
    error,
  };
};
