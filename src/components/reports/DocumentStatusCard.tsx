
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileCheck, FileX } from "lucide-react";

type DocumentAnalytics = {
  missingDocumentTypes: string[];
  documentCompletionByType: {
    [documentType: string]: {
      total: number;
      uploaded: number;
      completionPercentage: number;
    }
  };
};

type DocumentStatusCardProps = {
  documentAnalytics?: DocumentAnalytics;
};

export const DocumentStatusCard = ({ documentAnalytics }: DocumentStatusCardProps) => {
  const documentTypes = documentAnalytics?.documentCompletionByType 
    ? Object.entries(documentAnalytics.documentCompletionByType)
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Document Status</CardTitle>
        <CardDescription>Overview of document verification status</CardDescription>
      </CardHeader>
      <CardContent>
        {documentTypes.length > 0 ? (
          <div className="space-y-4">
            {documentTypes.map(([docType, stats]) => {
              const completionPercentage = Math.round((stats.uploaded / stats.total) * 100);
              
              return (
                <div key={docType} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{docType}</span>
                    <span className="text-muted-foreground">{stats.uploaded}/{stats.total}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={completionPercentage} className="h-2" />
                    <span className="text-xs w-10">{completionPercentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
              <div className="flex gap-2 items-center">
                <FileCheck className="h-5 w-5 text-green-500" />
                <span>Verified Documents</span>
              </div>
              <span className="font-semibold">24</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-md">
              <div className="flex gap-2 items-center">
                <FileX className="h-5 w-5 text-yellow-500" />
                <span>Pending Verification</span>
              </div>
              <span className="font-semibold">12</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
