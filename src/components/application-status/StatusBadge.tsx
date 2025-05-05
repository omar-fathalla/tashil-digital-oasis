
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return "bg-green-100 text-green-800 border-green-200";
      case 'rejected':
        return "bg-red-100 text-red-800 border-red-200";
      case 'pending':
      case 'under-review':
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <Badge
      variant="outline"
      className={getStatusColor(status)}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
