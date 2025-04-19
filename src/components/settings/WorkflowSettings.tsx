
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const WorkflowSettings = () => {
  const { toast } = useToast();
  const [workflowType, setWorkflowType] = useState("two-step");
  const [allowReupload, setAllowReupload] = useState(true);
  const [autoGenerateID, setAutoGenerateID] = useState(true);
  const [requireCollection, setRequireCollection] = useState(true);

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
      
      <Tabs defaultValue="review">
        <TabsList>
          <TabsTrigger value="review">Review Process</TabsTrigger>
          <TabsTrigger value="id-card">ID Card Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="review" className="space-y-4">
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
        </TabsContent>
        
        <TabsContent value="id-card" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Auto-generate ID Card After Approval</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automatically generate and store digital ID cards when a request is approved
                  </p>
                </div>
                <Switch
                  checked={autoGenerateID}
                  onCheckedChange={setAutoGenerateID}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Require Collection Confirmation</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Require collector's name to be recorded when ID cards are physically handed over
                  </p>
                </div>
                <Switch
                  checked={requireCollection}
                  onCheckedChange={setRequireCollection}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveChanges}>Save Workflow Settings</Button>
      </div>
    </div>
  );
};
