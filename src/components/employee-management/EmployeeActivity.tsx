
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { FileText, UserCheck, UserMinus, UserPlus, Edit, Activity, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface EmployeeActivityProps {
  employeeId?: string;
  isLoading: boolean;
}

interface ActivityLog {
  id: string;
  type: 'registration' | 'update' | 'suspension' | 'reactivation' | 'document' | 'other';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

const EmployeeActivity = ({ employeeId, isLoading }: EmployeeActivityProps) => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  
  // Simulate fetching activity logs
  useEffect(() => {
    if (!employeeId) return;

    // This would typically be an API call to fetch activity logs
    const timeout = setTimeout(() => {
      // Mock data - in a real app, this would come from the API
      const mockActivityLogs: ActivityLog[] = [
        {
          id: `${employeeId}-act-1`,
          type: 'registration',
          title: 'Employee Registered',
          description: 'Employee record was created in the system',
          timestamp: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
          user: 'System Admin',
        },
        {
          id: `${employeeId}-act-2`,
          type: 'update',
          title: 'Profile Updated',
          description: 'Employee information was updated',
          timestamp: new Date(Date.now() - 3600000 * 24 * 25).toISOString(),
          user: 'HR Manager',
        },
        {
          id: `${employeeId}-act-3`,
          type: 'document',
          title: 'Document Uploaded',
          description: 'ID Card was uploaded to the system',
          timestamp: new Date(Date.now() - 3600000 * 24 * 20).toISOString(),
          user: 'Document Manager',
        },
        {
          id: `${employeeId}-act-4`,
          type: 'update',
          title: 'Position Updated',
          description: 'Employee position was updated',
          timestamp: new Date(Date.now() - 3600000 * 24 * 15).toISOString(),
          user: 'HR Manager',
        },
        {
          id: `${employeeId}-act-5`,
          type: 'suspension',
          title: 'Account Suspended',
          description: 'Employee account was temporarily suspended',
          timestamp: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
          user: 'Security Manager',
        },
        {
          id: `${employeeId}-act-6`,
          type: 'reactivation',
          title: 'Account Reactivated',
          description: 'Employee account was reactivated',
          timestamp: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
          user: 'HR Manager',
        },
        {
          id: `${employeeId}-act-7`,
          type: 'document',
          title: 'Document Verified',
          description: 'ID Card was verified by HR',
          timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
          user: 'HR Manager',
        },
      ];
      
      setActivityLogs(mockActivityLogs);
      setLoadingActivity(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [employeeId]);
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <UserPlus className="h-5 w-5 text-green-600" />;
      case 'update':
        return <Edit className="h-5 w-5 text-blue-600" />;
      case 'suspension':
        return <UserMinus className="h-5 w-5 text-red-600" />;
      case 'reactivation':
        return <UserCheck className="h-5 w-5 text-green-600" />;
      case 'document':
        return <FileText className="h-5 w-5 text-yellow-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };
  
  if (isLoading || loadingActivity) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {Array(5).fill(null).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-4 w-20 flex-shrink-0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {activityLogs.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <p className="mt-2 text-muted-foreground">No activity logs found</p>
          </div>
        ) : (
          <div className="relative space-y-8 before:absolute before:inset-0 before:left-4 before:ml-0.5 before:h-full before:w-0.5 before:bg-muted">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex gap-4">
                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-md border">
                  {getActivityIcon(log.type)}
                </div>
                <div className="flex-grow pt-0.5">
                  <h6 className="font-medium">{log.title}</h6>
                  <p className="text-sm text-muted-foreground">{log.description}</p>
                  {log.user && (
                    <p className="text-xs text-muted-foreground mt-1">By: {log.user}</p>
                  )}
                </div>
                <div className="flex-shrink-0 whitespace-nowrap text-xs text-muted-foreground pt-1">
                  {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeActivity;
