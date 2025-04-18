
import { FileCheck, FileX, FileMinus } from "lucide-react";

type StatusIconProps = {
  status: string;
};

export const StatusIcon = ({ status }: StatusIconProps) => {
  switch (status) {
    case "approved":
      return <FileCheck className="h-5 w-5 text-green-600" />;
    case "rejected":
      return <FileX className="h-5 w-5 text-red-600" />;
    case "under-review":
      return <FileMinus className="h-5 w-5 text-yellow-600" />;
    default:
      return null;
  }
};
