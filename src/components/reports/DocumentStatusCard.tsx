
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileCheck, FileX } from "lucide-react";

export const DocumentStatusCard = () => {
  // Mock data for document status
  const totalDocumentsRequired = 8;
  const documentsUploaded = 6;
  const documentsVerified = 4;
  const documentsMissing = 2;
  
  const uploadedPercentage = (documentsUploaded / totalDocumentsRequired) * 100;
  const verifiedPercentage = (documentsVerified / totalDocumentsRequired) * 100;
  const missingPercentage = (documentsMissing / totalDocumentsRequired) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Document Status per Employee</CardTitle>
        <CardDescription>Overview of document submissions and verifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Uploaded Documents</span>
              <span className="text-sm text-muted-foreground">{documentsUploaded} of {totalDocumentsRequired}</span>
            </div>
            <Progress value={uploadedPercentage} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Verified Documents</span>
              <span className="text-sm text-muted-foreground">{documentsVerified} of {totalDocumentsRequired}</span>
            </div>
            <Progress value={verifiedPercentage} className="h-2 bg-gray-200">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${verifiedPercentage}%` }} 
              />
            </Progress>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Missing/Rejected Documents</span>
              <span className="text-sm text-muted-foreground">{documentsMissing} of {totalDocumentsRequired}</span>
            </div>
            <Progress value={missingPercentage} className="h-2 bg-gray-200">
              <div 
                className="h-full bg-red-500 rounded-full" 
                style={{ width: `${missingPercentage}%` }} 
              />
            </Progress>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <FileCheck className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Verified</p>
                <p className="text-xs text-muted-foreground">{documentsVerified} documents</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <FileX className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Missing/Rejected</p>
                <p className="text-xs text-muted-foreground">{documentsMissing} documents</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
