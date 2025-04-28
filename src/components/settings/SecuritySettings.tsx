
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const SecuritySettings = () => {
  const { toast } = useToast();
  const [passwordSettings, setPasswordSettings] = useState({
    minLength: "8",
    requireUppercase: true,
    requireNumbers: true,
    requireSpecial: false,
  });
  
  const [enable2FA, setEnable2FA] = useState(false);

  const handlePasswordSettingChange = (key: keyof typeof passwordSettings, value: string | boolean) => {
    setPasswordSettings({
      ...passwordSettings,
      [key]: value,
    });
  };

  const handleSaveChanges = () => {
    try {
      // Validate settings before saving
      if (parseInt(passwordSettings.minLength) < 6) {
        throw new Error("Minimum password length must be at least 6 characters");
      }

      // Success notification
      toast({
        title: "Settings Saved",
        description: "Security settings have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
        <p className="text-muted-foreground">
          Configure security settings and password policies.
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Password Policy</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">
                Minimum Password Length
              </label>
              <Input
                type="number"
                value={passwordSettings.minLength}
                onChange={(e) => handlePasswordSettingChange("minLength", e.target.value)}
                min="6"
                max="24"
                className="max-w-xs"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Require Uppercase Letters</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Passwords must contain at least one uppercase letter
                </p>
              </div>
              <Switch
                checked={passwordSettings.requireUppercase}
                onCheckedChange={(checked) => 
                  handlePasswordSettingChange("requireUppercase", checked)
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Require Numbers</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Passwords must contain at least one number
                </p>
              </div>
              <Switch
                checked={passwordSettings.requireNumbers}
                onCheckedChange={(checked) => 
                  handlePasswordSettingChange("requireNumbers", checked)
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Require Special Characters</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Passwords must contain at least one special character
                </p>
              </div>
              <Switch
                checked={passwordSettings.requireSpecial}
                onCheckedChange={(checked) => 
                  handlePasswordSettingChange("requireSpecial", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Two-Factor Authentication (2FA)</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Require 2FA for all administrative users
              </p>
            </div>
            <Switch
              checked={enable2FA}
              onCheckedChange={setEnable2FA}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveChanges}>Save Security Settings</Button>
      </div>
    </div>
  );
};

