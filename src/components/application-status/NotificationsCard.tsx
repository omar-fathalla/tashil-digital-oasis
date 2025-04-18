
import { Bell, FileX, FileMinus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";

const NotificationsCard = () => {
  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Bell className="h-5 w-5 text-primary mr-2" />
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="flex items-start gap-3 pb-4 border-b">
            <div className="bg-blue-100 p-2 rounded-full">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">Request Status Update</p>
              <p className="text-sm text-gray-600">Request REQ-2025-04873 has been approved. You can now download the digital ID.</p>
              <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
            </div>
          </li>
          <li className="flex items-start gap-3 pb-4 border-b">
            <div className="bg-red-100 p-2 rounded-full">
              <FileX className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium">Request Rejected</p>
              <p className="text-sm text-gray-600">Request REQ-2025-04871 was rejected. Please check the notes and re-upload the required documents.</p>
              <p className="text-xs text-gray-400 mt-1">1 day ago</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="bg-yellow-100 p-2 rounded-full">
              <FileMinus className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium">Request Under Review</p>
              <p className="text-sm text-gray-600">Request REQ-2025-04872 is currently under review. You will be notified once the status changes.</p>
              <p className="text-xs text-gray-400 mt-1">1 day ago</p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default NotificationsCard;
