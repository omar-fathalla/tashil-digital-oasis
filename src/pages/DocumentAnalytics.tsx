
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { DocumentStatsCards } from "@/components/document-analytics/DocumentStatsCards";
import { DocumentCategoryChart } from "@/components/document-analytics/DocumentCategoryChart";
import { ActivityTable } from "@/components/document-analytics/ActivityTable";
import { DocumentNotifications } from "@/components/notifications/DocumentNotifications"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportReportButton } from "@/components/document-analytics/ExportReportButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { FileText, Bell, BarChart, Download } from "lucide-react";

const DocumentAnalytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Document Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Monitor document activity and statistics
            </p>
          </div>
          <div className="flex gap-2">
            <ExportReportButton reportType="excel">
              <FileText className="h-4 w-4 mr-2" /> Export Excel
            </ExportReportButton>
            <ExportReportButton reportType="pdf">
              <Download className="h-4 w-4 mr-2" /> Export PDF
            </ExportReportButton>
          </div>
        </div>
        
        <div className="mb-6">
          <DocumentStatsCards />
        </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <DocumentCategoryChart />
          </div>
          <div className="col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DocumentNotifications />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Activity Monitor
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {format(new Date(), "MMMM yyyy")}
              </span>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Activity</TabsTrigger>
                  <TabsTrigger value="uploads">Uploads</TabsTrigger>
                  <TabsTrigger value="views">Views</TabsTrigger>
                  <TabsTrigger value="edits">Edits</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <ActivityTable limit={10} />
                </TabsContent>
                <TabsContent value="uploads">
                  <ActivityTable filters={{ action: 'upload' }} limit={10} />
                </TabsContent>
                <TabsContent value="views">
                  <ActivityTable filters={{ action: 'view' }} limit={10} />
                </TabsContent>
                <TabsContent value="edits">
                  <ActivityTable filters={{ action: 'edit' }} limit={10} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalytics;
