
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const InterfaceSettings = () => {
  const { toast } = useToast();
  const [language, setLanguage] = useState("english");
  const [enableBilingual, setEnableBilingual] = useState(true);
  const [theme, setTheme] = useState("light");

  const handleSaveChanges = () => {
    toast({
      title: "Success",
      description: "Interface settings saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Language & Interface Settings</h2>
        <p className="text-muted-foreground">
          Customize the application's appearance and language settings.
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium">Enable Bilingual UI</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Allow users to switch between Arabic and English
              </p>
            </div>
            <Switch
              checked={enableBilingual}
              onCheckedChange={setEnableBilingual}
            />
          </div>
          
          <h3 className="text-lg font-medium mb-4">Default Language</h3>
          <RadioGroup value={language} onValueChange={setLanguage} disabled={!enableBilingual}>
            <div className="flex items-center space-x-2 mb-4">
              <RadioGroupItem value="english" id="english" />
              <Label htmlFor="english">English</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="arabic" id="arabic" />
              <Label htmlFor="arabic">Arabic</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Theme Settings</h3>
          <RadioGroup value={theme} onValueChange={setTheme}>
            <div className="flex items-center space-x-2 mb-4">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light Theme</Label>
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark Theme</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System Preference</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveChanges}>Save Interface Settings</Button>
      </div>
    </div>
  );
};
