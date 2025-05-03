
import React from 'react';
import { Bell, FileCheck, FileMinus, FileX } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Notification } from "@/hooks/useNotifications";
import { format } from "date-fns";

interface GroupedNotificationsProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const GroupedNotifications = ({ notifications, onMarkAsRead }: GroupedNotificationsProps) => {
  const groupNotifications = () => {
    return {
      approvals: notifications.filter(n => (n.type || '').includes('approved')),
      rejections: notifications.filter(n => (n.type || '').includes('rejected')),
      documents: notifications.filter(n => 
        (n.type || '').includes('document') || 
        (n.type || '').includes('missing')
      ),
      other: notifications.filter(n => {
        const type = n.type || '';
        return !type.includes('approved') && 
              !type.includes('rejected') && 
              !type.includes('document') && 
              !type.includes('missing');
      })
    };
  };

  const getNotificationIcon = (type: string = '') => {
    if (type.includes('approved')) return <FileCheck className="h-5 w-5 text-green-600" />;
    if (type.includes('rejected')) return <FileX className="h-5 w-5 text-red-600" />;
    if (type.includes('document') || type.includes('missing')) return <FileMinus className="h-5 w-5 text-yellow-600" />;
    return <Bell className="h-5 w-5 text-blue-600" />;
  };

  const groupedNotifications = groupNotifications();

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div className={`flex items-start gap-3 py-3 ${!notification.read ? 'bg-muted/20 -mx-2 p-2 rounded' : ''}`}>
      <div className="bg-muted/10 p-2 rounded-full">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-medium">{notification.title}</p>
          {!notification.read && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
            >
              Mark as read
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {format(new Date(notification.created_at), "PPp")}
        </p>
      </div>
    </div>
  );

  const renderNotificationGroup = (title: string, notifications: Notification[], type: string) => {
    if (notifications.length === 0) return null;
    
    const unreadCount = notifications.filter(n => !n.read).length;
    
    return (
      <AccordionItem value={type}>
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-2">
            {title}
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      {renderNotificationGroup("Approvals", groupedNotifications.approvals, "approvals")}
      {renderNotificationGroup("Rejections", groupedNotifications.rejections, "rejections")}
      {renderNotificationGroup("Document Updates", groupedNotifications.documents, "documents")}
      {renderNotificationGroup("Other Notifications", groupedNotifications.other, "other")}
    </Accordion>
  );
};

export default GroupedNotifications;
