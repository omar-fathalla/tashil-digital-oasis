
import { CalendarRange, Clock, Users } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-1">Employee Registration Dashboard</h1>
      <p className="text-muted-foreground mb-4">
        Manage employee registration requests, approve applications and generate digital IDs
      </p>
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Users className="h-4 w-4 mr-2" />
          <span>3 team members online</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <CalendarRange className="h-4 w-4 mr-2" />
          <span>Viewing {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
};
