
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Printer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DigitalIDCard = () => {
  const { data: approvedRequests, isLoading } = useQuery({
    queryKey: ['approved-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('registration_requests')
        .select('*')
        .eq('status', 'approved')
        .order('submission_date', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  const handleDownload = (request: any) => {
    // Create a simple HTML structure for the ID card
    const idCardHTML = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="border: 2px solid #000; padding: 20px; max-width: 400px; margin: 0 auto;">
            <h2 style="text-align: center;">Employee Digital ID</h2>
            <div style="margin: 10px 0;">
              <strong>Name:</strong> ${request.full_name}
            </div>
            <div style="margin: 10px 0;">
              <strong>Employee ID:</strong> ${request.id_card?.id || 'N/A'}
            </div>
            <div style="margin: 10px 0;">
              <strong>Registration Date:</strong> ${new Date(request.submission_date).toLocaleDateString()}
            </div>
            <div style="margin: 10px 0;">
              <strong>ID Card Issue Date:</strong> ${request.id_card ? new Date(request.id_card.issue_date).toLocaleDateString() : 'N/A'}
            </div>
            <div style="margin: 10px 0;">
              <strong>ID Card Expiry Date:</strong> ${request.id_card ? new Date(request.id_card.expiry_date).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </body>
      </html>
    `;

    // Create a Blob from the HTML content
    const blob = new Blob([idCardHTML], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `employee-id-${request.id_card?.id || request.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = (request: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print ID Card - ${request.full_name}</title>
          </head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="border: 2px solid #000; padding: 20px; max-width: 400px; margin: 0 auto;">
              <h2 style="text-align: center;">Employee Digital ID</h2>
              <div style="margin: 10px 0;">
                <strong>Name:</strong> ${request.full_name}
              </div>
              <div style="margin: 10px 0;">
                <strong>Employee ID:</strong> ${request.id_card?.id || 'N/A'}
              </div>
              <div style="margin: 10px 0;">
                <strong>Registration Date:</strong> ${new Date(request.submission_date).toLocaleDateString()}
              </div>
              <div style="margin: 10px 0;">
                <strong>ID Card Issue Date:</strong> ${request.id_card ? new Date(request.id_card.issue_date).toLocaleDateString() : 'N/A'}
              </div>
              <div style="margin: 10px 0;">
                <strong>ID Card Expiry Date:</strong> ${request.id_card ? new Date(request.id_card.expiry_date).toLocaleDateString() : 'N/A'}
              </div>
            </div>
            <script>
              window.onload = () => {
                window.print();
                window.onafterprint = () => window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Digital ID Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p>Loading approved requests...</p>
          ) : approvedRequests && approvedRequests.length > 0 ? (
            <div className="space-y-4">
              {approvedRequests.map((request: any) => (
                <div key={request.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{request.full_name}</p>
                    <p className="text-sm text-muted-foreground">ID: {request.id_card?.id || 'Pending'}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(request)}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrint(request)}
                    >
                      <Printer className="h-4 w-4" />
                      Print
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No approved requests found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DigitalIDCard;
