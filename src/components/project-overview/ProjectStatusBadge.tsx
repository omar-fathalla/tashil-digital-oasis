
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Clock, CircleX } from "lucide-react";

interface ProjectStatusBadgeProps {
  status: string;
}

export const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CircleCheck className="h-4 w-4 text-green-500" />;
      case 'archived':
        return <CircleX className="h-4 w-4 text-gray-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-green-50 text-green-700 border-green-200";
      case 'archived':
        return "bg-gray-50 text-gray-700 border-gray-200";
      case 'in_progress':
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  return (
    <>
      <div className="mr-2">{getStatusIcon(status)}</div>
      <Badge variant="outline" className={cn(getBadgeVariant(status))}>
        {getStatusText(status)}
      </Badge>
    </>
  );
};
