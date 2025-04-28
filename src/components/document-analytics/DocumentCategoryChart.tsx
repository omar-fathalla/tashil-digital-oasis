
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDocumentAnalytics } from "@/hooks/useDocumentAnalytics";
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export const DocumentCategoryChart = () => {
  const { documentStats, isLoadingStats } = useDocumentAnalytics();
  
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#6366F1", "#EF4444"];
  
  const prepareChartData = () => {
    if (!documentStats?.categoryCounts) return [];
    
    return Object.entries(documentStats.categoryCounts).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));
  };

  const chartData = prepareChartData();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoadingStats ? (
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
        ) : chartData.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} documents`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No category data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};
