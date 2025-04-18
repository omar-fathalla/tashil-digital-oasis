
import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: string;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
    case "rejected":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rejected</Badge>;
    case "under-review":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Under Review</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};
