
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailNotificationRequest {
  to: string;
  subject: string;
  eventType: string;
  details: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, eventType, details }: EmailNotificationRequest = await req.json();

    // Generate email content based on event type
    let htmlContent = `<h2>${subject}</h2>`;
    
    switch (eventType) {
      case "document_uploaded":
        htmlContent += `
          <p>A new document "${details.documentName}" has been uploaded.</p>
          <p>Date: ${new Date().toLocaleString()}</p>
        `;
        break;
      case "access_granted":
        htmlContent += `
          <p>You have been granted access to document "${details.documentName}".</p>
          <p>Granted by: ${details.grantedBy}</p>
        `;
        break;
      case "document_updated":
        htmlContent += `
          <p>The document "${details.documentName}" has been updated.</p>
          <p>Updated by: ${details.updatedBy}</p>
          <p>Changes: ${details.changes}</p>
        `;
        break;
      default:
        htmlContent += `<p>${details.message || "No additional details available."}</p>`;
    }

    const emailResponse = await resend.emails.send({
      from: "Tashil <notifications@yourdomain.com>",
      to: [to],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error sending notification email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
