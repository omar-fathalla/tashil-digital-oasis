
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { EmployeeRegion } from "@/hooks/useReportData";

type EmployeesByRegionChartProps = {
  data: EmployeeRegion[];
};

export const EmployeesByRegionChart = ({ data }: EmployeesByRegionChartProps) => {
  const colors = ["#4f46e5", "#3b82f6", "#0ea5e9", "#06b6d4", "#14b8a6"];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-xl">Employees by Region</CardTitle>
        <CardDescription>Distribution of registered employees across regions</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <XAxis 
              dataKey="region" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: any) => [`${value} employees`, "Count"]}
              labelFormatter={(label) => `Region: ${label}`}
            />
            <Bar dataKey="count" name="Employees">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
