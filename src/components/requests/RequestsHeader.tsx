
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { RequestForm } from "./RequestForm";
import { useQueryClient } from "@tanstack/react-query";

export function RequestsHeader() {
  const queryClient = useQueryClient();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold">Employee Requests</h2>
        <p className="text-muted-foreground mt-1">Manage and track employee requests</p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit New Request</DialogTitle>
            <DialogDescription>
              Fill out the form below to submit a new employee request.
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
