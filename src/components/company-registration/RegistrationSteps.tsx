
import { Building, User, Upload } from "lucide-react";

interface RegistrationStepsProps {
  currentStep: number;
}

export function RegistrationSteps({ currentStep }: RegistrationStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === 0 ? 'bg-primary text-white' : 'bg-primary-100 text-primary'}`}>
            <Building className="h-5 w-5" />
          </div>
          <span className={`ml-3 text-sm font-medium ${currentStep === 0 ? 'text-primary' : 'text-gray-500'}`}>Company Details</span>
        </div>
        <div className="w-12 h-1 bg-gray-200">
          <div className={`h-full bg-primary ${currentStep > 0 ? 'w-full' : 'w-0'} transition-all`}></div>
        </div>
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-primary text-white' : currentStep > 1 ? 'bg-primary-100 text-primary' : 'bg-gray-100 text-gray-400'}`}>
            <User className="h-5 w-5" />
          </div>
          <span className={`ml-3 text-sm font-medium ${currentStep === 1 ? 'text-primary' : currentStep > 1 ? 'text-primary' : 'text-gray-400'}`}>Account Setup</span>
        </div>
        <div className="w-12 h-1 bg-gray-200">
          <div className={`h-full bg-primary ${currentStep > 1 ? 'w-full' : 'w-0'} transition-all`}></div>
        </div>
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
            <Upload className="h-5 w-5" />
          </div>
          <span className={`ml-3 text-sm font-medium ${currentStep === 2 ? 'text-primary' : 'text-gray-400'}`}>Documents</span>
        </div>
      </div>
    </div>
  );
}
