
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const WorkflowSettings = () => {
  const { toast } = useToast();
  const [workflowType, setWorkflowType] = useState("two-step");
  const [allowReupload, setAllowReupload] = useState(true);

  const handleSaveChanges = () => {
    toast({
      title: "Success",
      description: "Workflow settings saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Workflow Settings</h2>
        <p className="text-muted-foreground">
          Configure the review and approval process for requests.
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Review Process</h3>
          <RadioGroup value={workflowType} onValueChange={setWorkflowType}>
            <div className="flex items-start space-x-2 mb-4">
              <RadioGroupItem value="one-step" id="one-step" />
              <div className="grid gap-1.5">
                <Label htmlFor="one-step" className="font-medium">One-step Review</Label>
                <p className="text-sm text-muted-foreground">
                  Single reviewer handles both reviewing and approving requests
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="two-step" id="two-step" />
              <div className="grid gap-1.5">
                <Label htmlFor="two-step" className="font-medium">Two-step Review</Label>
                <p className="text-sm text-muted-foreground">
                  Initial review followed by final approval from authorized personnel
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Allow File Re-upload After Rejection</h3>
              <p className="text-sm text-muted-foreground mt-1">
                When enabled, users can re-upload files after their request is rejected
              </p>
            </div>
            <Switch
              checked={allowReupload}
              onCheckedChange={setAllowReupload}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveChanges}>Save Workflow Settings</Button>
      </div>
    </div>
  );
};
