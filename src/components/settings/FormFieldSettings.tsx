
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface FormField {
  id: string;
  name: string;
  enabled: boolean;
  required: boolean;
  visibility: "all" | "admin" | "company" | "employee";
}

export const FormFieldSettings = () => {
  const { toast } = useToast();
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: "1", name: "Full Name", enabled: true, required: true, visibility: "all" },
    { id: "2", name: "National ID", enabled: true, required: true, visibility: "all" },
    { id: "3", name: "Insurance Number", enabled: true, required: false, visibility: "all" },
    { id: "4", name: "Mother's Name", enabled: false, required: false, visibility: "admin" },
    { id: "5", name: "Address", enabled: true, required: true, visibility: "all" },
    { id: "6", name: "Phone Number", enabled: true, required: true, visibility: "all" },
    { id: "7", name: "Email", enabled: true, required: false, visibility: "all" },
    { id: "8", name: "Date of Birth", enabled: true, required: true, visibility: "all" },
    { id: "9", name: "Position", enabled: true, required: true, visibility: "company" },
    { id: "10", name: "Area", enabled: true, required: true, visibility: "company" },
  ]);

  const updateField = (id: string, field: keyof FormField, value: any) => {
    setFormFields(
      formFields.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
    
    toast({
      title: "Settings updated",
      description: "Form field settings have been updated successfully.",
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Success",
      description: "All form field settings have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Edit Registration Form Fields</h2>
        <p className="text-muted-foreground">
          Configure which fields are displayed on registration forms and their requirements.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field Name</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Visibility</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formFields.map((field) => (
                  <TableRow key={field.id}>
                    <TableCell className="font-medium">{field.name}</TableCell>
                    <TableCell>
                      <Switch
                        checked={field.enabled}
                        onCheckedChange={(checked) =>
                          updateField(field.id, "enabled", checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={field.required}
                        disabled={!field.enabled}
                        onCheckedChange={(checked) =>
                          updateField(field.id, "required", checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={field.visibility}
                        onValueChange={(value) =>
                          updateField(field.id, "visibility", value)
                        }
                        disabled={!field.enabled}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="admin">Admin Only</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
