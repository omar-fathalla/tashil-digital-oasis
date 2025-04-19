
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const NotificationSettings = () => {
  const { toast } = useToast();
  const [notificationEvents, setNotificationEvents] = useState({
    successfulSubmission: true,
    approvalNotification: true,
    rejectionNotification: true,
    missingDocuments: true,
    expiringDocuments: false,
  });
  
  const [deliveryMethods, setDeliveryMethods] = useState({
    email: true,
    sms: false,
    inApp: true,
  });

  const toggleNotification = (key: keyof typeof notificationEvents) => {
    setNotificationEvents({
      ...notificationEvents,
      [key]: !notificationEvents[key],
    });
  };

  const toggleDeliveryMethod = (key: keyof typeof deliveryMethods) => {
    setDeliveryMethods({
      ...deliveryMethods,
      [key]: !deliveryMethods[key],
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Success",
      description: "Notification settings saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
        <p className="text-muted-foreground">
          Configure when and how notifications are sent to users.
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Notification Events</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Successful Submissions</p>
                <p className="text-sm text-muted-foreground">
                  Notify when a registration is successfully submitted
                </p>
              </div>
              <Switch
                checked={notificationEvents.successfulSubmission}
                onCheckedChange={() => toggleNotification("successfulSubmission")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Request Approvals</p>
                <p className="text-sm text-muted-foreground">
                  Notify when a request is approved
                </p>
              </div>
              <Switch
                checked={notificationEvents.approvalNotification}
                onCheckedChange={() => toggleNotification("approvalNotification")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Request Rejections</p>
                <p className="text-sm text-muted-foreground">
                  Notify when a request is rejected
                </p>
              </div>
              <Switch
                checked={notificationEvents.rejectionNotification}
                onCheckedChange={() => toggleNotification("rejectionNotification")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Missing Documents</p>
                <p className="text-sm text-muted-foreground">
                  Notify when required documents are missing
                </p>
              </div>
              <Switch
                checked={notificationEvents.missingDocuments}
                onCheckedChange={() => toggleNotification("missingDocuments")}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Expiring Documents</p>
                <p className="text-sm text-muted-foreground">
                  Notify when documents are about to expire
                </p>
              </div>
              <Switch
                checked={notificationEvents.expiringDocuments}
                onCheckedChange={() => toggleNotification("expiringDocuments")}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Delivery Methods</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="email" 
                checked={deliveryMethods.email}
                onCheckedChange={() => toggleDeliveryMethod("email")}
              />
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email Notifications
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sms" 
                checked={deliveryMethods.sms}
                onCheckedChange={() => toggleDeliveryMethod("sms")}
              />
              <label
                htmlFor="sms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                SMS Notifications
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="in-app" 
                checked={deliveryMethods.inApp}
                onCheckedChange={() => toggleDeliveryMethod("inApp")}
              />
              <label
                htmlFor="in-app"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                In-App Notifications
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveChanges}>Save Notification Settings</Button>
      </div>
    </div>
  );
};
