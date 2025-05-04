
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Activity, UserCog, Calendar } from "lucide-react";

interface ActivityLog {
  id: string;
  activity: string;
  timestamp: string;
  actorName?: string;
  actorRole?: string;
}

interface EmployeeActivityProps {
  employeeId?: string;
}

const EmployeeActivity = ({ employeeId }: EmployeeActivityProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    // Simulate API fetch
    const fetchActivityLogs = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, this would fetch from a logs table
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demo purposes
        const mockLogs: ActivityLog[] = [
          {
            id: '1',
            activity: 'Employee profile created',
            timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            actorName: 'System',
            actorRole: 'Automated'
          },
          {
            id: '2',
            activity: 'Documents uploaded',
            timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            actorName: 'Jane Smith',
            actorRole: 'HR Manager'
          },
          {
            id: '3',
            activity: 'Employee status changed to "approved"',
            timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            actorName: 'John Davis',
            actorRole: 'Department Manager'
          },
          {
            id: '4',
            activity: 'Digital ID generated',
            timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            actorName: 'System',
            actorRole: 'Automated'
          },
          {
            id: '5',
            activity: 'ID card printed',
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            actorName: 'Sarah Johnson',
            actorRole: 'Administrative Assistant'
          }
        ];
        
        setActivityLogs(mockLogs);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (employeeId) {
      fetchActivityLogs();
    }
  }, [employeeId]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(5).fill(null).map((_, i) => (
            <div key={i} className="flex gap-4 items-start">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>History of actions performed on this employee record</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          Export History
        </Button>
      </CardHeader>
      <CardContent>
        {activityLogs.length > 0 ? (
          <div className="space-y-8">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex gap-4">
                <div className="mt-1">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">{log.activity}</p>
                  <div className="flex gap-2 items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(log.timestamp), "MMMM d, yyyy 'at' h:mm a")}</span>
                  </div>
                  {(log.actorName || log.actorRole) && (
                    <div className="flex gap-2 items-center text-sm text-muted-foreground mt-1">
                      <UserCog className="h-3 w-3" />
                      <span>{`${log.actorName}${log.actorRole ? ` (${log.actorRole})` : ''}`}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Activity className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-semibold">No Activity Recorded</h3>
            <p className="text-sm text-muted-foreground">
              No actions have been performed on this employee record yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeActivity;
