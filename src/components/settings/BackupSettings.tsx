import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const BackupSettings = () => {
  const { settings, updateSettings } = useSystemSettings('backup');
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState({
    scheduledBackups: true,
    backupFrequency: "daily",
    exportFormat: "csv",
    backupDestination: "firebase",
    apiKey: "",
  });

  useEffect(() => {
    // Initialize local state from database settings
    if (settings.length > 0) {
      const backupSettings = settings.reduce((acc, setting) => ({
        ...acc,
        [setting.key]: setting.value
      }), {});
      setLocalSettings(prev => ({ ...prev, ...backupSettings }));
    }
  }, [settings]);

  const handleSaveChanges = () => {
    updateSettings.mutate(localSettings);
  };

  const handleExportNow = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting data in ${format.toUpperCase()} format...`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Data Backup & Export</h2>
        <p className="text-muted-foreground">
          Configure data backup settings and export options.
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium">Enable Scheduled Backups</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Automatically backup data on a regular schedule
              </p>
            </div>
            <Switch
              checked={localSettings.scheduledBackups}
              onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, scheduledBackups: checked }))}
            />
          </div>
          
          {localSettings.scheduledBackups && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Backup Frequency
                </label>
                <Select 
                  value={localSettings.backupFrequency} 
                  onValueChange={(value) => setLocalSettings(prev => ({ ...prev, backupFrequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">
                  Backup Destination
                </label>
                <Select 
                  value={localSettings.backupDestination} 
                  onValueChange={(value) => setLocalSettings(prev => ({ ...prev, backupDestination: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="firebase">Firebase Storage</SelectItem>
                    <SelectItem value="s3">Amazon S3</SelectItem>
                    <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {localSettings.backupDestination !== "firebase" && (
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Storage Credentials
                  </label>
                  <Input 
                    type="password" 
                    placeholder="Enter storage API key" 
                    value={localSettings.apiKey}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your credentials are encrypted and stored securely
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Data Export</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">
                Default Export Format
              </label>
              <Select 
                value={localSettings.exportFormat} 
                onValueChange={(value) => setLocalSettings(prev => ({ ...prev, exportFormat: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Button 
                variant="outline" 
                className="flex items-center justify-center"
                onClick={() => handleExportNow("csv")}
              >
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center justify-center"
                onClick={() => handleExportNow("excel")}
              >
                <Download className="h-4 w-4 mr-2" />
                Export as Excel
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center justify-center"
                onClick={() => handleExportNow("json")}
              >
                <Download className="h-4 w-4 mr-2" />
                Export as JSON
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveChanges}>Save Backup Settings</Button>
      </div>
    </div>
  );
};
