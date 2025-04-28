
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSystemSettings } from "@/hooks/useSystemSettings";

export const EmailPreferences = () => {
  const { toast } = useToast();
  const { settings, updateSettings } = useSystemSettings("email_preferences");
  const [preferences, setPreferences] = useState({
    document_uploaded: true,
    access_granted: true,
    document_updated: true,
    ...settings.reduce((acc, setting) => ({
      ...acc,
      [setting.key]: setting.value,
    }), {}),
  });

  const handleToggle = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(preferences);
      toast({
        title: "Success",
        description: "Email preferences saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save email preferences",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Document Uploads</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications when new documents are uploaded
              </p>
            </div>
            <Switch
              checked={preferences.document_uploaded}
              onCheckedChange={() => handleToggle("document_uploaded")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Access Changes</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications when you are granted access to documents
              </p>
            </div>
            <Switch
              checked={preferences.access_granted}
              onCheckedChange={() => handleToggle("access_granted")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Document Updates</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications when documents are updated
              </p>
            </div>
            <Switch
              checked={preferences.document_updated}
              onCheckedChange={() => handleToggle("document_updated")}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
