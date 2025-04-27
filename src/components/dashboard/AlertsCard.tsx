
import { AlertCircle, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/hooks/useNotifications";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AlertsCard = () => {
  const { 
    notifications, 
    isLoading, 
    error, 
    markAsRead, 
    deleteNotification, 
    unreadCount 
  } = useNotifications();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 border-b pb-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load notifications. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const getNotificationIcon = (type: string = 'default') => {
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
        <div className="space-y-4 max-h-[300px] overflow-y-auto">
          {notifications && notifications.length > 0 ? (
            notifications.slice(0, 5).map((notification) => (
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
                <div className="flex flex-col gap-2">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => markAsRead.mutate(notification.id)}
                    >
                      Mark as read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteNotification.mutate(notification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
