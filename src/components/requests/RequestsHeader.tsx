
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { RequestForm } from "./RequestForm";
import { useQueryClient } from "@tanstack/react-query";

interface RequestsHeaderProps {
  type?: "employee" | "company";
}

export function RequestsHeader({ type = "employee" }: RequestsHeaderProps) {
  const queryClient = useQueryClient();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold">
          {type === "employee" ? "Employee Requests" : "Company Requests"}
        </h2>
        <p className="text-muted-foreground mt-1">
          {type === "employee" 
            ? "Manage and track employee requests" 
            : "Manage and track company registration requests"}
        </p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New {type === "employee" ? "Employee" : "Company"} Request
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit New {type === "employee" ? "Employee" : "Company"} Request</DialogTitle>
            <DialogDescription>
              Fill out the form below to submit a new {type.toLowerCase()} request.
            </DialogDescription>
          </DialogHeader>
          <RequestForm onRequestSubmitted={() => {
            queryClient.invalidateQueries({ queryKey: ["employee-requests"] });
          }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
