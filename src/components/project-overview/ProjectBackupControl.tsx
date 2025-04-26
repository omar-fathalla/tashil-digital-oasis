
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { BackupFileUpload } from "@/components/backup/BackupFileUpload";
import { BackupPreviewTable } from "@/components/backup/BackupPreviewTable";
import { Download, Upload, UploadCloud, Calendar, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ProjectBackupControlProps {
  projectId: string;
}

export const ProjectBackupControl = ({ projectId }: ProjectBackupControlProps) => {
  const [backupData, setBackupData] = useState<any[]>([]);
  const [backupFile, setBackupFile] = useState<File | null>(null);
  const [backupType, setBackupType] = useState<"json" | "csv" | null>(null);
  
  const handleFileParsed = (data: any[], file: File, type: "json" | "csv") => {
    setBackupData(data);
    setBackupFile(file);
    setBackupType(type);
  };

  const handleDataRestore = () => {
    toast.success("Project data restored successfully");
    // In a real app, this would call an API to restore data
    setBackupData([]);
    setBackupFile(null);
  };

  const handleManualBackup = () => {
    toast.success("Manual backup created successfully");
    // In a real app, this would call an API to create backup
  };

  const exportJsonData = () => {
    // Mock project data for export example
    const mockData = {
      project_id: projectId,
      name: "Tashil Project",
      description: "A streamlined project to facilitate processes",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      data: [
        { id: 1, item: "Sample data 1" },
        { id: 2, item: "Sample data 2" },
      ]
    };
    
    const dataStr = JSON.stringify(mockData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `tashil-project-backup-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    
    toast.success("Project data exported successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Backup & Restore</CardTitle>
        <CardDescription>
          Backup project data or restore from a previous backup
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="backup">
          <TabsList className="mb-4">
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="restore">Restore</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="backup">
            <div className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Manual Backup</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a full backup of this project's current data
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleManualBackup}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Create Backup
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={exportJsonData}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export as JSON
                  </Button>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Backup History</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View and download previous backups
                </p>
                <div className="space-y-4">
                  <div className="bg-background border rounded-md p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Auto Backup</p>
                      <p className="text-xs text-muted-foreground">Today at 09:00 AM</p>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                  <div className="bg-background border rounded-md p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Manual Backup</p>
                      <p className="text-xs text-muted-foreground">Yesterday at 4:30 PM</p>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="restore">
            <div className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Upload Backup File</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a JSON or CSV file to restore project data
                </p>
                <BackupFileUpload onFileParsed={handleFileParsed} />
              </div>
              
              {backupFile && backupData.length > 0 && (
                <div className="bg-muted/30 p-4 rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-medium">Backup Preview</h3>
                      <p className="text-xs text-muted-foreground">
                        {backupFile.name} ({backupData.length} records)
                      </p>
                    </div>
                    <Button onClick={handleDataRestore} className="gap-2">
                      <UploadCloud className="h-4 w-4" />
                      Restore Data
                    </Button>
                  </div>
                  <BackupPreviewTable data={backupData} rowsPerPage={5} />
                </div>
              )}
              
              {!backupFile && (
                <div className="text-center p-8 border border-dashed rounded-md">
                  <p className="text-muted-foreground">
                    Upload a backup file to preview and restore data
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="schedule">
            <div className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Automatic Backup Schedule</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure automatic backup schedule for this project
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch id="auto-backup" />
                      <Label htmlFor="auto-backup">Enable Automatic Backups</Label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="frequency" className="mb-2 block">Frequency</Label>
                      <Select>
                        <SelectTrigger id="frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="time" className="mb-2 block">Time</Label>
                      <Select>
                        <SelectTrigger id="time">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="00:00">12:00 AM</SelectItem>
                          <SelectItem value="06:00">6:00 AM</SelectItem>
                          <SelectItem value="12:00">12:00 PM</SelectItem>
                          <SelectItem value="18:00">6:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="retention" className="mb-2 block">Retention Policy</Label>
                    <Select>
                      <SelectTrigger id="retention">
                        <SelectValue placeholder="Select retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Keep backups for 7 days</SelectItem>
                        <SelectItem value="30">Keep backups for 30 days</SelectItem>
                        <SelectItem value="90">Keep backups for 90 days</SelectItem>
                        <SelectItem value="365">Keep backups for 1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full sm:w-auto">Save Schedule Settings</Button>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Next Scheduled Backups</h3>
                <div className="space-y-2">
                  <div className="flex items-center p-2 bg-background rounded border">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Tomorrow at 6:00 AM</span>
                  </div>
                  <div className="flex items-center p-2 bg-background rounded border">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>May 3, 2025 at 6:00 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
