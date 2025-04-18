
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type RegistrationsByDateChartProps = {
  data: Record<string, number>;
};

export const RegistrationsByDateChart = ({ data }: RegistrationsByDateChartProps) => {
  // Transform the data for the chart
  const chartData = Object.entries(data).map(([date, count]) => ({
    date,
    count,
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-xl">Registrations by Date</CardTitle>
        <CardDescription>Number of employees registered over time</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <XAxis 
              dataKey="date" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              tick={{ fontSize: 12 }} 
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: any) => [`${value} registrations`, "Count"]}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString();
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              name="Registrations" 
              stroke="#3b82f6" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
