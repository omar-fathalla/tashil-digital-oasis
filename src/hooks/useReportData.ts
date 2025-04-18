
import { useQuery } from "@tanstack/react-query";

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
  analyticInsights: {
    incompleteSubmissionRisk: number;
    averageReviewTime: number;
    documentCompletionRate: number;
    reviewerPerformance: {
      [reviewerName: string]: {
        totalReviewed: number;
        approvalRate: number;
        averageProcessingTime: number;
      }
    };
  };
  documentAnalytics: {
    missingDocumentTypes: string[];
    documentCompletionByType: {
      [documentType: string]: {
        total: number;
        uploaded: number;
        completionPercentage: number;
      }
    };
  };
};

export const useReportData = () => {
  return useQuery({
    queryKey: ["report-data"],
    queryFn: async (): Promise<ReportData> => {
      // Mock data - no Supabase connection
      const mockApplications = generateMockApplications();
      
      const totalEmployees = mockApplications.length;
      const approvedEmployees = mockApplications.filter(app => app.status === "approved").length;
      const pendingEmployees = mockApplications.filter(app => app.status === "under-review").length;
      const rejectedEmployees = mockApplications.filter(app => app.status === "rejected").length;

      const analyticInsights = {
        incompleteSubmissionRisk: pendingEmployees / totalEmployees,
        averageReviewTime: calculateAverageReviewTime(mockApplications),
        documentCompletionRate: calculateDocumentCompletionRate(mockApplications),
        reviewerPerformance: calculateReviewerPerformance(mockApplications)
      };

      const documentAnalytics = {
        missingDocumentTypes: detectMissingDocumentTypes(mockApplications),
        documentCompletionByType: calculateDocumentCompletionByType(mockApplications)
      };

      return {
        totalEmployees,
        approvedEmployees,
        pendingEmployees,
        rejectedEmployees,
        analyticInsights,
        documentAnalytics,
        employeesByRegion: generateEmployeesByRegion(),
        registrationsByDate: generateRegistrationsByDate(),
        reviewerActivity: generateReviewerActivity(),
        incompleteSubmissions: generateIncompleteSubmissions(mockApplications),
        documentUploads: generateDocumentUploads(mockApplications)
      };
    },
  });
};

// Mock application data generator
function generateMockApplications() {
  const statuses = ["approved", "under-review", "rejected"];
  const applications = [];
  
  for (let i = 0; i < 50; i++) {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const employeeName = `Employee ${i + 1}`;
    const notes = randomStatus === "approved" 
      ? `All documents verified. Reviewed by: Reviewer${Math.floor(Math.random() * 3) + 1}`
      : `Pending verification. Reviewed by: Reviewer${Math.floor(Math.random() * 3) + 1}`;
    
    applications.push({
      id: `app-${i + 1}`,
      employee_name: employeeName,
      employee_id: `EMP-${1000 + i}`,
      status: randomStatus,
      notes: notes,
      request_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  
  return applications;
}

function calculateAverageReviewTime(applications) {
  const reviewTimes = applications
    .filter(app => app.status !== "under-review")
    .map(app => {
      const requestDate = new Date(app.request_date);
      const reviewDate = new Date(); // Placeholder for actual review date
      return (reviewDate.getTime() - requestDate.getTime()) / (1000 * 60 * 60); // Hours
    });

  return reviewTimes.length 
    ? reviewTimes.reduce((a, b) => a + b, 0) / reviewTimes.length 
    : 0;
}

function calculateDocumentCompletionRate(applications) {
  const completedApplications = applications.filter(app => 
    app.status === "approved" && 
    app.notes && app.notes.includes("All documents verified")
  );

  return completedApplications.length / applications.length;
}

function calculateReviewerPerformance(applications) {
  const performanceByReviewer = {};

  applications.forEach(app => {
    if (app.notes) {
      const reviewer = app.notes.match(/Reviewed by: (\w+)/)?.[1];
      if (reviewer) {
        if (!performanceByReviewer[reviewer]) {
          performanceByReviewer[reviewer] = {
            totalReviewed: 0,
            approved: 0
          };
        }

        performanceByReviewer[reviewer].totalReviewed++;
        if (app.status === "approved") {
          performanceByReviewer[reviewer].approved++;
        }
      }
    }
  });

  return Object.fromEntries(
    Object.entries(performanceByReviewer).map(([reviewer, stats]) => {
      const reviewerStats = stats as { totalReviewed: number; approved: number };
      return [
        reviewer, 
        {
          totalReviewed: reviewerStats.totalReviewed,
          approvalRate: reviewerStats.approved / reviewerStats.totalReviewed,
          averageProcessingTime: 24 // Placeholder - hours
        }
      ];
    })
  );
}

function detectMissingDocumentTypes(applications) {
  const requiredDocuments = [
    "ID Card", 
    "Passport", 
    "Proof of Address", 
    "Employment Contract"
  ];

  return requiredDocuments.filter(doc => 
    applications.some(app => !app.notes?.includes(doc))
  );
}

function calculateDocumentCompletionByType(applications) {
  const documentTypes = [
    "ID Card", 
    "Passport", 
    "Proof of Address", 
    "Employment Contract"
  ];

  const result = {};
  documentTypes.forEach(docType => {
    const uploaded = applications.filter(app => 
      app.notes && app.notes.includes(docType)
    ).length;
    
    const total = applications.length;
    
    result[docType] = {
      total,
      uploaded,
      completionPercentage: (uploaded / total) * 100
    };
  });

  return result;
}

function generateEmployeesByRegion() {
  return [
    { region: "Cairo", count: Math.floor(Math.random() * 50) + 10 },
    { region: "Alexandria", count: Math.floor(Math.random() * 40) + 5 },
    { region: "Damanhur", count: Math.floor(Math.random() * 30) + 3 },
    { region: "North Coast", count: Math.floor(Math.random() * 20) + 2 },
    { region: "Giza", count: Math.floor(Math.random() * 45) + 8 }
  ];
}

function generateRegistrationsByDate() {
  const today = new Date();
  const registrationsByDate: Record<string, number> = {};

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    registrationsByDate[dateString] = Math.floor(Math.random() * 10);
  }

  return registrationsByDate;
}

function generateReviewerActivity() {
  return [
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
}

function generateIncompleteSubmissions(applications) {
  return applications
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
}

function generateDocumentUploads(applications) {
  return applications.slice(0, 10).map(app => ({
    employeeName: app.employee_name,
    documentType: ["ID Card", "Employment Contract", "Health Certificate", "Passport", "Bank Account"][Math.floor(Math.random() * 5)],
    uploadDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    status: ["verified", "pending", "rejected"][Math.floor(Math.random() * 3)]
  }));
}
