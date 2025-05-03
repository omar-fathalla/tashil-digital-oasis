import { useNotifications } from "@/hooks/useNotifications";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export const DocumentNotifications = () => {
  const { 
    notifications, 
    isLoading, 
    unreadCount,
    markAsRead,
    deleteNotification
  } = useNotifications();
  
  useEffect(() => {
    // Auto-refresh every minute to keep notifications current
    const interval = setInterval(() => {
      // Implement refresh mechanism if needed
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="w-full">
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">
              All
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread {unreadCount > 0 && <span className="ml-1 bg-primary text-primary-foreground rounded-full h-5 min-w-[20px] flex items-center justify-center text-xs">{unreadCount}</span>}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <NotificationList 
            notifications={notifications} 
            isLoading={isLoading}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
          />
        </TabsContent>
        
        <TabsContent value="unread" className="mt-0">
          <NotificationList 
            notifications={notifications.filter(n => !n.read)} 
            isLoading={isLoading}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            emptyMessage="No unread notifications"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface NotificationListProps {
  notifications: any[];
  isLoading: boolean;
  onMarkAsRead: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  emptyMessage?: string;
}

const NotificationList = ({
  notifications,
  isLoading,
  onMarkAsRead,
  onDelete,
  emptyMessage = "No notifications"
}: NotificationListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border rounded-md">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-muted/10">
        <Bell className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-3 border rounded-md transition-colors ${!notification.read ? 'bg-muted/20' : ''}`}
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <h4 className="font-medium text-sm">{notification.title}</h4>
                {notification.message && (
                  <p className="text-muted-foreground text-sm mt-1">{notification.message}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(notification.created_at), 'MMM d, yyyy - HH:mm')}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onMarkAsRead(notification.id)}
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(notification.id)}
                  title="Delete notification"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
