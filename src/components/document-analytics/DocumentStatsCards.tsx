
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocumentAnalytics } from "@/hooks/useDocumentAnalytics";
import { FileText, Users, Upload, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const DocumentStatsCards = () => {
  const { documentStats, isLoadingStats } = useDocumentAnalytics();
  
  // Calculate the total downloads (just a sample value)
  const totalDownloads = Math.floor((documentStats?.totalCount || 0) * 1.5);
  
  // Count unique users (just a sample value)
  const uniqueUsers = Math.floor((documentStats?.totalCount || 0) * 0.3) + 5;
  
  // Calculate recent uploads (just a sample value)
  const recentUploads = documentStats?.monthlyUploads?.length 
    ? documentStats.monthlyUploads[documentStats.monthlyUploads.length - 1].count
    : 0;
  
  const stats = [
    {
      title: "Total Documents",
      value: documentStats?.totalCount || 0,
      icon: FileText,
      className: "text-blue-600"
    },
    {
      title: "Total Downloads",
      value: totalDownloads,
      icon: Download,
      className: "text-green-600"
    },
    {
      title: "Active Users",
      value: uniqueUsers,
      icon: Users,
      className: "text-purple-600"
    },
    {
      title: "Recent Uploads",
      value: recentUploads,
      icon: Upload,
      className: "text-amber-600"
    }
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                {isLoadingStats ? (
                  <Skeleton className="h-9 w-16 mt-1" />
                ) : (
                  <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                )}
              </div>
              <div className={`p-2 rounded-full bg-muted ${stat.className}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
