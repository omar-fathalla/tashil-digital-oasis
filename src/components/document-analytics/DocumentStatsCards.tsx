import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocumentAnalytics } from "@/hooks/useDocumentAnalytics";
import { BarChart3, FileText, FileLock, Calendar } from "lucide-react";
import { SkeletonCard } from "@/components/ui/skeleton/SkeletonCard";
import { useLoadingState } from "@/hooks/useLoadingState";

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const stats = [
  {
    title: "Total Documents",
    value: 0,
    icon: <FileText className="h-6 w-6 text-blue-500" />,
    description: "Documents in system",
    color: "bg-blue-50",
  },
  {
    title: "This Month",
    value: 0,
    icon: <Calendar className="h-6 w-6 text-emerald-500" />,
    description: "Uploaded this month",
    color: "bg-emerald-50",
  },
  {
    title: "Encrypted",
    value: 0,
    icon: <FileLock className="h-6 w-6 text-amber-500" />,
    description: "Protected documents",
    color: "bg-amber-50",
  },
  {
    title: "Total Size",
    value: "0 KB",
    icon: <BarChart3 className="h-6 w-6 text-purple-500" />,
    description: "Storage used",
    color: "bg-purple-50",
  },
];

export const DocumentStatsCards = () => {
  const { documentStats, isLoading: isDataLoading } = useDocumentAnalytics();
  const isLoading = useLoadingState(documentStats, 600);

  if (isLoading || isDataLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} header={true} rows={1} />
        ))}
      </div>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const stats = [
    {
      title: "Total Documents",
      value: documentStats?.totalDocuments || 0,
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      description: "Documents in system",
      color: "bg-blue-50",
    },
    {
      title: "This Month",
      value: documentStats?.uploadedThisMonth || 0,
      icon: <Calendar className="h-6 w-6 text-emerald-500" />,
      description: "Uploaded this month",
      color: "bg-emerald-50",
    },
    {
      title: "Encrypted",
      value: documentStats?.encryptedCount || 0,
      icon: <FileLock className="h-6 w-6 text-amber-500" />,
      description: "Protected documents",
      color: "bg-amber-50",
    },
    {
      title: "Total Size",
      value: documentStats ? formatFileSize(documentStats.totalSize) : "0 KB",
      icon: <BarChart3 className="h-6 w-6 text-purple-500" />,
      description: "Storage used",
      color: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.color} p-2 rounded-md`}>{stat.icon}</div>
            </div>
          </CardHeader>
          <CardContent>
            
              <div className="text-2xl font-bold">
                {typeof stat.value === 'number' ? new Intl.NumberFormat().format(stat.value) : stat.value}
              </div>
            
            <CardDescription>{stat.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
