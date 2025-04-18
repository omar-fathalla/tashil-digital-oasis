
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export type EmployeeRegion = {
  region: string;
  count: number;
};

export type ReviewerActivity = {
  reviewer: string;
  total: number;
  approved: number;
  rejected: number;
};

export type IncompleteSubmission = {
  id: string;
  employeeName: string;
  employeeId: string;
  missingDocuments: string[];
};

export type DocumentUpload = {
  employeeName: string;
  documentType: string;
  uploadDate: string;
  status: string;
};

export type ReportData = {
  totalEmployees: number;
  approvedEmployees: number;
  pendingEmployees: number;
  rejectedEmployees: number;
  employeesByRegion: EmployeeRegion[];
  registrationsByDate: Record<string, number>;
  reviewerActivity: ReviewerActivity[];
  incompleteSubmissions: IncompleteSubmission[];
  documentUploads: DocumentUpload[];
};

export const useReportData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["report-data", user?.id],
    queryFn: async (): Promise<ReportData> => {
      // Fetch all applications
      const { data: applications, error } = await supabase
        .from("applications")
        .select("*");

      if (error) {
        console.error("Error fetching applications:", error);
        throw error;
      }

      // Calculate total employees
      const totalEmployees = applications.length;

      // Calculate approved, pending, and rejected employees
      const approvedEmployees = applications.filter(app => app.status === "approved").length;
      const pendingEmployees = applications.filter(app => app.status === "under-review").length;
      const rejectedEmployees = applications.filter(app => app.status === "rejected").length;

      // Extract regions from notes (for demonstration purposes)
      // In a real application, region might be a specific field
      const employeesByRegion: EmployeeRegion[] = [
        { region: "Cairo", count: Math.floor(Math.random() * 50) + 10 },
        { region: "Alexandria", count: Math.floor(Math.random() * 40) + 5 },
        { region: "Damanhur", count: Math.floor(Math.random() * 30) + 3 },
        { region: "North Coast", count: Math.floor(Math.random() * 20) + 2 },
        { region: "Giza", count: Math.floor(Math.random() * 45) + 8 }
      ];

      // Generate registrations by date (for demonstration purposes)
      // In a real application, you'd use the actual created_at dates
      const registrationsByDate: Record<string, number> = {};
      const today = new Date();
      
      // Generate data for the last 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        registrationsByDate[dateString] = Math.floor(Math.random() * 10);
      }

      // Generate reviewer activity (for demonstration purposes)
      const reviewerActivity: ReviewerActivity[] = [
        { 
          reviewer: "Reviewer 1", 
          total: 45, 
          approved: 30, 
          rejected: 15 
        },
        { 
          reviewer: "Reviewer 2", 
          total: 35, 
          approved: 22, 
          rejected: 13 
        },
        { 
          reviewer: "Reviewer 3", 
          total: 50, 
          approved: 40, 
          rejected: 10 
        }
      ];

      // Generate incomplete submissions (for demonstration)
      const incompleteSubmissions: IncompleteSubmission[] = applications
        .filter(app => app.status === "under-review")
        .slice(0, 5)
        .map(app => ({
          id: app.id,
          employeeName: app.employee_name,
          employeeId: app.employee_id,
          missingDocuments: [
            "ID Card",
            "Employment Contract",
            "Health Certificate"
          ].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1)
        }));

      // Generate document uploads (for demonstration)
      const documentUploads: DocumentUpload[] = applications.slice(0, 10).map(app => ({
        employeeName: app.employee_name,
        documentType: ["ID Card", "Employment Contract", "Health Certificate", "Passport", "Bank Account"][Math.floor(Math.random() * 5)],
        uploadDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        status: ["verified", "pending", "rejected"][Math.floor(Math.random() * 3)]
      }));

      return {
        totalEmployees,
        approvedEmployees,
        pendingEmployees,
        rejectedEmployees,
        employeesByRegion,
        registrationsByDate,
        reviewerActivity,
        incompleteSubmissions,
        documentUploads
      };
    },
    enabled: !!user,
  });
};
