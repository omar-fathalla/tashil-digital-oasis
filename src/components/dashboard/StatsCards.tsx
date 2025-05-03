
import { Users, FileText, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStats } from "@/hooks/useStats";
import { Skeleton } from "@/components/ui/skeleton";
import CountUp from "react-countup";

export const StatsCards = () => {
  const { totalEmployees, totalCompanies, pendingRequests, isLoading } = useStats();

  if (isLoading) {
    return (
      <>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-1" />
              <Skeleton className="h-3 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  return (
    <>
      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CountUp end={totalEmployees} duration={2} separator="," />
          </div>
          <p className="text-xs text-muted-foreground">Registered employees in system</p>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Companies Registered</CardTitle>
          <Database className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CountUp end={totalCompanies} duration={2} separator="," />
          </div>
          <p className="text-xs text-muted-foreground">Active companies</p>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          <FileText className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CountUp end={pendingRequests || 0} duration={2} separator="," />
          </div>
          <p className="text-xs text-muted-foreground">{pendingRequests === 1 ? '1 new request today' : `${pendingRequests} new requests today`}</p>
        </CardContent>
      </Card>
    </>
  );
};
