
import { QrCode } from "lucide-react";

interface IDCardPreviewProps {
  request: any;
}

const IDCardPreview = ({ request }: IDCardPreviewProps) => {
  // Convert cm to pixels (assuming 96 DPI)
  const cmToPx = (cm: number) => cm * 37.795275591;

  return (
    <div 
      className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
      style={{
        width: `${cmToPx(2.5)}px`,
        height: `${cmToPx(5)}px`,
      }}
    >
      <div className="p-3 flex flex-col items-center justify-between h-full">
        <div className="w-full text-center">
          <img
            src="/placeholder.svg"
            alt="Company Logo"
            className="h-8 mx-auto mb-2"
          />
          <h3 className="font-semibold text-sm">{request.full_name}</h3>
          <p className="text-xs text-muted-foreground">ID: {request.id_card?.id || 'N/A'}</p>
        </div>
        
        <div className="text-center w-full">
          <p className="text-xs text-muted-foreground mb-1">{request.company_name || 'Company Name'}</p>
          <p className="text-xs text-muted-foreground">
            Registered: {new Date(request.submission_date).getFullYear()}
          </p>
        </div>

        <div className="flex justify-center items-center">
          <QrCode className="h-8 w-8 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default IDCardPreview;
