
import { FormData, UploadedFiles } from "./types";
import { CheckCircle2 } from "lucide-react";

interface ReviewStepProps {
  formData: FormData;
  uploadedFiles: UploadedFiles;
}

export const ReviewStep = ({ formData, uploadedFiles }: ReviewStepProps) => {
  // Helper function to get full name from form data
  const getFullName = () => {
    return `${formData.firstName || ""} ${formData.midName || ""} ${formData.lastName || ""}`.trim() || "Not provided";
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium mb-3">Employee Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Employee Name</p>
            <p className="font-medium">{getFullName()}</p>
          </div>
          <div>
            <p className="text-gray-500">Employee ID</p>
            <p className="font-medium">{formData.employeeId || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-500">Gender</p>
            <p className="font-medium">{formData.sex || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-500">Position</p>
            <p className="font-medium">{formData.position || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-500">Request Type</p>
            <p className="font-medium">{formData.requestType || "Not provided"}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium mb-3">Uploaded Documents</h3>
        <div className="space-y-3">
          {Object.entries(uploadedFiles).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-500">
                {key === "idDocument" && "ID / Passport Copy"}
                {key === "authorizationLetter" && "Authorization Letter"}
                {key === "paymentReceipt" && "Payment Receipt"}
                {key === "employeePhoto" && "Employee Photo"}
              </span>
              <span className="text-sm text-green-600 font-medium flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                {value ? "Uploaded" : "Not uploaded"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          By submitting this request, you confirm that all provided information is accurate
          and you have authorization to submit this request on behalf of your company.
        </p>
      </div>
    </div>
  );
};
