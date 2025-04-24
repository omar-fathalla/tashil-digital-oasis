import { Bell, FileX, FileMinus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const NotificationsCard = () => {
  // Sample notification data
  const notifications = [
    {
      id: "1",
      type: "request_approved",
      title: "Request Approved",
      message: "Your registration request for John Doe has been approved",
      read: false,
      created_at: "2025-04-24T08:30:00Z"
    },
    {
      id: "2",
      type: "missing_documents",
      title: "Missing Documents",
      message: "Please upload the required identification documents for Sarah Smith",
      read: false,
      created_at: "2025-04-24T07:15:00Z"
    },
    {
      id: "3",
      type: "document_rejected",
      title: "Document Rejected",
      message: "The submitted photo ID for Michael Johnson needs to be updated",
      read: true,
      created_at: "2025-04-23T15:45:00Z"
    },
    {
      id: "4",
      type: "id_generated",
      title: "ID Card Generated",
      message: "Employee ID card for Emma Wilson is ready for printing",
      read: true,
      created_at: "2025-04-23T11:20:00Z"
    }
  ];

  const markAsRead = {
    mutate: (id: string) => {
      console.log("Marking notification as read:", id);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "request_approved":
        return <Bell className="h-5 w-5 text-blue-600" />;
      case "request_rejected":
        return <FileX className="h-5 w-5 text-red-600" />;
      case "missing_documents":
        return <FileMinus className="h-5 w-5 text-yellow-600" />;
      case "document_rejected":
        return <FileX className="h-5 w-5 text-red-600" />;
      case "id_generated":
        return <Bell className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationBackground = (type: string) => {
    switch (type) {
      case "request_approved":
        return "bg-blue-100";
      case "request_rejected":
        return "bg-red-100";
      case "missing_documents":
        return "bg-yellow-100";
      case "document_rejected":
        return "bg-red-100";
      case "id_generated":
        return "bg-green-100";
      default:
        return "bg-blue-100";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} days ago`;
    }
    
    return format(date, "d MMM yyyy");
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-primary mr-2" />
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          {notifications.some(n => !n.read) && (
            <Badge variant="destructive" className="rounded-full">
              {notifications.filter(n => !n.read).length} unread
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li 
                key={notification.id} 
                className={`flex items-start gap-3 pb-4 border-b ${!notification.read ? 'bg-muted/20 -mx-2 p-2 rounded' : ''}`}
              >
                <div className={`${getNotificationBackground(notification.type)} p-2 rounded-full`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{notification.title}</p>
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markAsRead.mutate(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{getTimeAgo(notification.created_at)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground py-8">No notifications at this time</p>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsCard;
