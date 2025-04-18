
import { User, Upload, CreditCard } from "lucide-react";

interface ProgressStepsProps {
  currentStep: number;
}

export const ProgressSteps = ({ currentStep }: ProgressStepsProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === 0 ? 'bg-primary text-white' : 'bg-primary-100 text-primary'}`}>
            <User className="h-5 w-5" />
          </div>
          <span className={`ml-3 text-sm font-medium ${currentStep === 0 ? 'text-primary' : 'text-gray-500'}`}>Employee Information</span>
        </div>
        <div className="w-12 h-1 bg-gray-200">
          <div className={`h-full bg-primary ${currentStep > 0 ? 'w-full' : 'w-0'} transition-all`}></div>
        </div>
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-primary text-white' : currentStep > 1 ? 'bg-primary-100 text-primary' : 'bg-gray-100 text-gray-400'}`}>
            <Upload className="h-5 w-5" />
          </div>
          <span className={`ml-3 text-sm font-medium ${currentStep === 1 ? 'text-primary' : currentStep > 1 ? 'text-primary' : 'text-gray-400'}`}>Documents</span>
        </div>
        <div className="w-12 h-1 bg-gray-200">
          <div className={`h-full bg-primary ${currentStep > 1 ? 'w-full' : 'w-0'} transition-all`}></div>
        </div>
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
            <CreditCard className="h-5 w-5" />
          </div>
          <span className={`ml-3 text-sm font-medium ${currentStep === 2 ? 'text-primary' : 'text-gray-400'}`}>Review</span>
        </div>
      </div>
    </div>
  );
};
