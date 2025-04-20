
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useAuth } from "@/components/AuthProvider"
import { supabase } from "@/integrations/supabase/client"

const requestFormSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  requestType: z.string().min(1, "Request type is required"),
})

type RequestFormData = z.infer<typeof requestFormSchema>

export function SubmitRequestForm() {
  const { user } = useAuth()
  
  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      userId: user?.id || "",
      requestType: "",
    },
  })

  async function onSubmit(data: RequestFormData) {
    try {
      const { error } = await supabase
        .from("requests")
        .insert([
          {
            user_id: data.userId,
            request_type: data.requestType,
            status: 'pending'
          }
        ])

      if (error) throw error

      toast.success("Request submitted successfully")
      form.reset()
    } catch (error) {
      console.error("Error submitting request:", error)
      toast.error("Failed to submit request")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter User UUID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requestType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g. employee_form" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Submit Request</Button>
      </form>
    </Form>
  )
}
