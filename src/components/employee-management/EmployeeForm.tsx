
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CompanyEmployee, EmployeeFormData } from "@/types/employee";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  mid_name: z.string().optional(),
  last_name: z.string().min(1, "Last name is required"),
  national_id: z.string().min(1, "National ID is required"),
  insurance_number: z.string().min(1, "Insurance number is required"),
  gender: z.enum(["male", "female"]),
  address: z.string().optional(),
  area: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  position: z.string().optional(),
});

const DOCUMENT_TYPES = [
  { key: "id_card", label: "ID Card (Front)" },
  { key: "personal_photo", label: "Personal Photo" },
  { key: "insurance_certificate", label: "Insurance Certificate" },
  { key: "health_certificate", label: "Health Certificate" },
  { key: "q1_form", label: "Q1 Form (if applicable)" }
];

interface EmployeeFormProps {
  employee?: CompanyEmployee;
  onSubmit: (data: { employeeData: EmployeeFormData, documents: Record<string, File> }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function EmployeeForm({ employee, onSubmit, onCancel, isSubmitting }: EmployeeFormProps) {
  const [documents, setDocuments] = useState<Record<string, File>>({});
  
  // Fetch areas for dropdown
  const { data: areas = [] } = useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      // This would normally fetch from the database, but for now we're using static data
      return ["Cairo", "Alexandria", "Giza", "Sharm El Sheikh", "Hurghada", "Luxor", "Aswan"];
    }
  });
  
  // Fetch position types for dropdown
  const { data: positions = [] } = useQuery({
    queryKey: ['system-settings', 'position-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('category', 'form_fields')
        .eq('key', 'position_types')
        .single();

      if (error) return [];
      
      if (Array.isArray(data?.value)) {
        return data.value;
      }
      
      try {
        return JSON.parse(data?.value || '[]');
      } catch (e) {
        return [];
      }
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: employee?.first_name || "",
      mid_name: employee?.mid_name || "",
      last_name: employee?.last_name || "",
      national_id: employee?.national_id || "",
      insurance_number: employee?.insurance_number || "",
      gender: employee?.gender || "male",
      address: employee?.address || "",
      area: employee?.area || "",
      email: employee?.email || "",
      position: employee?.position || "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      event.target.value = ""; // Reset input
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload an image or PDF file");
      event.target.value = ""; // Reset input
      return;
    }

    setDocuments((prev) => ({ ...prev, [type]: file }));
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // For new employees, validate that all required documents are uploaded
    if (!employee && Object.keys(documents).length < 3) {
      toast.error("Please upload required documents (ID Card, Personal Photo, and Insurance Certificate)");
      return;
    }

    onSubmit({
      employeeData: values,
      documents
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{employee ? "Edit Employee" : "Add New Employee"}</CardTitle>
        <CardDescription>
          {employee
            ? "Update employee information"
            : "Fill in the form below to add a new employee"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mid_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Middle name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="national_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>National ID*</FormLabel>
                    <FormControl>
                      <Input placeholder="National ID number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="insurance_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="Insurance number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender*</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {positions.map((position: any) => (
                          <SelectItem key={position.id} value={position.name}>
                            {position.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Document Uploads</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DOCUMENT_TYPES.map((doc) => (
                  <div key={doc.key} className="space-y-1">
                    <FormLabel htmlFor={doc.key}>
                      {doc.label} {doc.key !== "q1_form" && "*"}
                    </FormLabel>
                    <Input
                      id={doc.key}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(e, doc.key)}
                      required={!employee && doc.key !== "q1_form"}
                    />
                    {documents[doc.key] && (
                      <p className="text-xs text-green-600">
                        {documents[doc.key].name} uploaded
                      </p>
                    )}
                    {employee?.documents?.[doc.key] && !documents[doc.key] && (
                      <p className="text-xs text-blue-600">Document already uploaded</p>
                    )}
                  </div>
                ))}
              </div>
              <FormDescription className="mt-2">
                Upload images or PDF files. Maximum size: 5MB per file.
              </FormDescription>
            </div>

            <CardFooter className="flex justify-end gap-2 p-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : employee ? "Update Employee" : "Add Employee"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
