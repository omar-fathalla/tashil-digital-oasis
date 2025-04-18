
import { Card } from "@/components/ui/card";

type DigitalIDProps = {
  employeeName: string;
  employeeId: string;
  company: string;
  position: string;
  photo: string;
  issueDate: string;
};

export const DigitalID = ({
  employeeName,
  employeeId,
  company,
  position,
  photo,
  issueDate
}: DigitalIDProps) => {
  const formattedIssueDate = new Date(issueDate).toLocaleDateString();
  const expiryDate = new Date(new Date(issueDate).setFullYear(new Date(issueDate).getFullYear() + 1)).toLocaleDateString();

  return (
    <Card className="w-full max-w-md overflow-hidden border-2 border-primary">
      <div className="bg-primary p-4 text-center text-white">
        <h2 className="font-bold text-xl">EMPLOYEE IDENTIFICATION</h2>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-24 h-32 rounded overflow-hidden bg-gray-100 flex-shrink-0">
            <img 
              src={photo} 
              alt={employeeName} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold">{employeeName}</h3>
            <p className="text-sm text-gray-500 capitalize">{position}</p>
            <div className="mt-3 space-y-1">
              <div>
                <span className="text-xs text-gray-500">Employee ID</span>
                <p className="font-mono font-medium">{employeeId}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Company</span>
                <p className="font-medium">{company}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <span className="text-xs text-gray-500">Issue Date</span>
            <p className="font-medium">{formattedIssueDate}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Expiry Date</span>
            <p className="font-medium">{expiryDate}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 text-center">
        <p className="text-xs text-gray-500">This ID card is the property of the company. If found, please return to the HR department.</p>
      </div>
    </Card>
  );
};
