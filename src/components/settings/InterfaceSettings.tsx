
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { useToast } from "@/hooks/use-toast";

export const InterfaceSettings = () => {
  const { settings, updateSettings } = useSystemSettings('interface');
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState({
    language: "english",
    enableBilingual: true,
    theme: "light"
  });

  useEffect(() => {
    if (settings.length > 0) {
      const interfaceSettings = settings.reduce((acc, setting) => ({
        ...acc,
        [setting.key]: setting.value
      }), {});
      setLocalSettings(prev => ({ ...prev, ...interfaceSettings }));
    }
  }, [settings]);

  const handleSaveChanges = () => {
    updateSettings.mutate(localSettings);
    toast({
      title: "Success",
      description: "Interface settings saved successfully",
    });
  };

  // Create typed handler functions for each setting
  const handleBilingualToggle = (checked: boolean) => {
    setLocalSettings(prev => ({ ...prev, enableBilingual: checked }));
  };

  const handleLanguageChange = (value: string) => {
    setLocalSettings(prev => ({ ...prev, language: value }));
  };

  const handleThemeChange = (value: string) => {
    setLocalSettings(prev => ({ ...prev, theme: value }));
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
              checked={localSettings.enableBilingual}
              onCheckedChange={handleBilingualToggle}
            />
          </div>
          
          <h3 className="text-lg font-medium mb-4">Default Language</h3>
          <RadioGroup value={localSettings.language} onValueChange={handleLanguageChange} disabled={!localSettings.enableBilingual}>
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
          <RadioGroup value={localSettings.theme} onValueChange={handleThemeChange}>
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
