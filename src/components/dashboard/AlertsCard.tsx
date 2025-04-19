
import { AlertCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/hooks/useNotifications";
import { format } from "date-fns";

export const AlertsCard = () => {
  const { notifications, isLoading, markAsRead, unreadCount } = useNotifications();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading alerts...</p>
        </CardContent>
      </Card>
    );
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "request_approved":
        return <Bell className="h-4 w-4 text-green-500" />;
      case "request_rejected":
        return <Bell className="h-4 w-4 text-red-500" />;
      case "missing_documents":
        return <Bell className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          Alerts
          {unreadCount > 0 && (
            <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </CardTitle>
        <AlertCircle className="h-4 w-4 text-red-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications && notifications.length > 0 ? (
            notifications.slice(0, 3).map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 border-b pb-3 last:border-0 ${
                  !notification.read ? "bg-muted/30 -mx-2 p-2 rounded" : ""
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(notification.created_at), "PPp")}
                  </p>
                </div>
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
            ))
          ) : (
            <p className="text-muted-foreground">No alerts at this time.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
