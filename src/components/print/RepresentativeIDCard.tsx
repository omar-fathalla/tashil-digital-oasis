
import { Card } from "@/components/ui/card";
import { User, Calendar, Building, QrCode } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

interface RepresentativeIDCardProps {
  representative: any;
  company?: any;
}

const RepresentativeIDCard = ({ representative, company }: RepresentativeIDCardProps) => {
  const formatDate = (date: string) => {
    return format(new Date(date), "MMM d, yyyy");
  };

  return (
    <div className="id-card relative">
      <Card 
        className="mx-auto bg-white overflow-hidden shadow-xl print:shadow-none"
        style={{
          width: "5cm",
          height: "8cm",
          maxWidth: "100%"
        }}
      >
        <div className="p-4 flex flex-col items-center justify-between h-full">
          {/* Header with Logo */}
          <div className="w-full flex items-center justify-center border-b pb-2 mb-4">
            <img
              src="/placeholder.svg"
              alt="Company Logo"
              className="h-8"
            />
          </div>

          {/* Profile Photo */}
          <div className="mb-4">
            <Avatar className="w-24 h-24 border-2 border-primary">
              <AvatarImage src={representative.photo_url} alt={representative.full_name} />
              <AvatarFallback>
                <User className="w-12 h-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Representative Details */}
          <div className="text-center space-y-2 flex-1">
            <h3 className="font-bold text-lg">{representative.full_name}</h3>
            <p className="text-sm text-muted-foreground">ID: {representative.employee_id}</p>
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Building className="w-4 h-4 mr-1" />
              <span>{company?.company_name || "Company Name"}</span>
            </div>
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              <span>Joined {formatDate(representative.created_at)}</span>
            </div>
            <p className="text-sm font-medium text-primary">{representative.type.toUpperCase()}</p>
          </div>

          {/* QR Code */}
          <div className="mt-4">
            <QrCode className="w-12 h-12 text-primary mx-auto" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RepresentativeIDCard;
