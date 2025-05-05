
import { ActivityTable } from "@/components/document-analytics/ActivityTable";
import { DocumentCategoryChart } from "@/components/document-analytics/DocumentCategoryChart";
import { DocumentStatsCards } from "@/components/document-analytics/DocumentStatsCards";
import { ExportReportButton } from "@/components/document-analytics/ExportReportButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DocumentAnalytics = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Document Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Insights and statistics about document usage
            </p>
          </div>
          <ExportReportButton />
        </div>

        {/* Stats Overview */}
        <DocumentStatsCards />

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DocumentCategoryChart />
              
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Document Uploads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Chart showing uploads over time
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <ActivityTable limit={10} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DocumentAnalytics;
