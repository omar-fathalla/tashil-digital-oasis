
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const requestFormSchema = z.object({
  employee_name: z.string().min(2, {
    message: "Employee name must be at least 2 characters.",
  }),
  employee_id: z.string().min(1, {
    message: "Employee ID is required.",
  }),
  request_type: z.string().min(1, {
    message: "Request type is required.",
  }),
});

type RequestFormData = z.infer<typeof requestFormSchema>;

const REQUEST_TYPES = [
  "New Registration",
  "Update Information",
  "ID Renewal",
  "Access Request",
  "Other",
];

export function RequestForm({ onRequestSubmitted }: { onRequestSubmitted: () => void }) {
  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      employee_name: "",
      employee_id: "",
      request_type: "",
    },
  });

  const onSubmit = async (data: RequestFormData) => {
    try {
      const { error } = await supabase.from("employee_requests").insert([
        {
          employee_name: data.employee_name,
          employee_id: data.employee_id,
          request_type: data.request_type,
        },
      ]);

      if (error) throw error;

      toast.success("Request submitted successfully");
      form.reset();
      onRequestSubmitted();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
        <FormField
          control={form.control}
          name="employee_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter employee name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="employee_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter employee ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="request_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a request type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {REQUEST_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Submit Request
        </Button>
      </form>
    </Form>
  );
}
