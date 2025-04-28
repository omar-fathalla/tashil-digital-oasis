
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SendEmailParams {
  to: string;
  subject: string;
  eventType: string;
  details: Record<string, any>;
}

export function useEmailNotifications() {
  const { toast } = useToast();

  const sendNotificationEmail = async ({
    to,
    subject,
    eventType,
    details,
  }: SendEmailParams) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "send-notification-email",
        {
          body: { to, subject, eventType, details },
        }
      );

      if (error) throw error;

      toast({
        title: "Notification sent",
        description: "Email notification has been sent successfully",
      });

      return data;
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Error",
        description: "Failed to send email notification",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { sendNotificationEmail };
}
