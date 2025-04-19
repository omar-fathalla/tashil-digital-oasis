
import { QrCode, User, Building, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";

interface IDCardPreviewProps {
  request: any;
}

const IDCardPreview = ({ request }: IDCardPreviewProps) => {
  // Convert cm to pixels (assuming 96 DPI)
  const cmToPx = (cm: number) => cm * 37.795275591;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Extract employee data
  const {
    full_name,
    national_id,
    submission_date,
    employee_details
  } = request;
  
  const company_name = employee_details?.company_name || 'Company Name';
  
  return (
    <div className="id-card relative">
      <Card 
        className="mx-auto bg-white overflow-hidden shadow-xl print:shadow-none"
        style={{
          width: `${cmToPx(5)}px`,
          height: `${cmToPx(2.5)}px`,
          maxWidth: "100%"
        }}
      >
        <div className="p-2 flex flex-col items-center justify-between h-full">
          <div className="w-full flex items-center justify-between border-b pb-1 mb-1">
            <div className="flex items-center">
              <img
                src="/placeholder.svg"
                alt="Company Logo"
                className="h-6 w-6 mr-1"
              />
              <span className="font-bold text-xs">{company_name}</span>
            </div>
            <div className="text-right">
              <p className="text-[8px] text-muted-foreground">ID: {national_id?.substring(0, 8) || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex w-full items-center mb-1">
            <div className="bg-muted rounded-full p-1 mr-2">
              <User className="h-3 w-3" />
            </div>
            <div>
              <h3 className="font-semibold text-xs line-clamp-1">{full_name}</h3>
              <p className="text-[8px] text-muted-foreground">
                <Calendar className="h-2 w-2 inline mr-1" />
                {formatDate(submission_date)}
              </p>
            </div>
          </div>
          
          <div className="w-full flex items-end justify-between">
            <div className="text-[8px] text-muted-foreground">
              <Building className="h-2 w-2 inline mr-1" />
              {company_name}
            </div>
            <div>
              <QrCode className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </Card>
      
      <div className="print-only-details hidden print:block mt-4">
        <h3 className="text-sm font-medium">Employee Details</h3>
        <p className="text-xs">Name: {full_name}</p>
        <p className="text-xs">ID: {national_id || 'N/A'}</p>
        <p className="text-xs">Issue Date: {formatDate(submission_date)}</p>
        <p className="text-xs">Company: {company_name}</p>
      </div>
    </div>
  );
};

export default IDCardPreview;
