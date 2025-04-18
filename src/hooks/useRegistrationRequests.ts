
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { DateRange } from "react-day-picker";

// Types for our registration requests
export type RegistrationRequest = {
  id: string;
  employeeName: string;
  employeeId: string;
  nationalId: string;
  insuranceNumber: string;
  company: string;
  submissionDate: string;
  status: "pending" | "approved" | "rejected";
  area: string;
  position: string;
  documents: {
    idDocument: string;
    photo: string;
    insuranceDocument: string;
    authorizationLetter: string;
  };
  reviewerId?: string;
  reviewerName?: string;
  reviewDate?: string;
  rejectionReason?: string;
  notes?: string;
};

type FilterOptions = {
  status?: string;
  searchQuery?: string;
  dateRange?: { from: Date | null; to: Date | null } | DateRange;
  area?: string;
  company?: string;
};

export const useRegistrationRequests = (filters: FilterOptions = {}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [flaggedRequests, setFlaggedRequests] = useState<string[]>([]);

  // Mock data for demonstration - would be replaced by real API calls
  const fetchRegistrationRequests = async () => {
    // This would be a real API call in production
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock data
    const mockRequests: RegistrationRequest[] = Array.from({ length: 25 }).map((_, i) => {
      const id = `REG-${1000 + i}`;
      const status = ["pending", "approved", "rejected"][Math.floor(Math.random() * 3)] as "pending" | "approved" | "rejected";
      const area = ["alexandria", "cairo"][Math.floor(Math.random() * 2)];
      const company = ["TechCorp", "GlobalServices", "LocalBusiness"][Math.floor(Math.random() * 3)];
      const submissionDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
      
      return {
        id,
        employeeName: `Employee ${i + 1}`,
        employeeId: `EMP-${2000 + i}`,
        nationalId: `${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
        insuranceNumber: `INS-${5000 + i}`,
        company,
        submissionDate,
        status,
        area,
        position: ["promoter", "superuser"][Math.floor(Math.random() * 2)],
        documents: {
          idDocument: "/placeholder.svg",
          photo: "/placeholder.svg",
          insuranceDocument: "/placeholder.svg",
          authorizationLetter: "/placeholder.svg"
        },
        reviewerId: status !== "pending" ? `REVIEWER-${i % 5}` : undefined,
        reviewerName: status !== "pending" ? `Reviewer ${i % 5 + 1}` : undefined,
        reviewDate: status !== "pending" ? new Date(Date.parse(submissionDate) + 24 * 60 * 60 * 1000).toISOString() : undefined,
        rejectionReason: status === "rejected" ? "Missing or incorrect documents" : undefined,
        notes: status !== "pending" ? "All documents have been verified." : undefined
      };
    });
    
    // Apply filters
    return mockRequests.filter(request => {
      // Filter by status
      if (filters.status && request.status !== filters.status) return false;
      
      // Filter by search query (name, id, or national id)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (
          !request.employeeName.toLowerCase().includes(query) &&
          !request.employeeId.toLowerCase().includes(query) &&
          !request.nationalId.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      
      // Filter by date range
      if (filters.dateRange) {
        const { from, to } = filters.dateRange;
        const submissionDate = new Date(request.submissionDate);
        if (from && submissionDate < from) return false;
        if (to && submissionDate > to) return false;
      }
      
      // Filter by area
      if (filters.area && request.area !== filters.area) return false;
      
      // Filter by company
      if (filters.company && request.company !== filters.company) return false;
      
      return true;
    });
  };

  // Query for fetching registration requests
  const { data: registrationRequests = [], isLoading, error } = useQuery({
    queryKey: ['registrationRequests', filters],
    queryFn: fetchRegistrationRequests,
  });

  // Mutation for approving requests
  const approveMutation = useMutation({
    mutationFn: async ({ requestId, notes }: { requestId: string; notes?: string }) => {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['registrationRequests'] });
      toast({
        title: "Request Approved",
        description: `Request ${variables.requestId} has been approved successfully.`,
      });
    },
  });

  // Mutation for rejecting requests
  const rejectMutation = useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: string; reason: string }) => {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['registrationRequests'] });
      toast({
        title: "Request Rejected",
        description: `Request ${variables.requestId} has been rejected.`,
        variant: "destructive",
      });
    },
  });

  // Helper functions for AI features (mock implementation)
  const flagRequestsWithMissingDocuments = (requests: RegistrationRequest[]) => {
    // In a real system, this would check document validity
    const flagged = requests
      .filter(req => req.status === "pending" && Math.random() > 0.7)
      .map(req => req.id);
    
    setFlaggedRequests(flagged);
    return flagged;
  };

  // Call our helper function whenever requests update
  if (registrationRequests.length > 0) {
    flagRequestsWithMissingDocuments(registrationRequests);
  }

  return {
    registrationRequests,
    isLoading,
    error,
    flaggedRequests,
    approveRequest: (requestId: string, notes?: string) => 
      approveMutation.mutate({ requestId, notes }),
    rejectRequest: (requestId: string, reason: string) => 
      rejectMutation.mutate({ requestId, reason }),
  };
};
