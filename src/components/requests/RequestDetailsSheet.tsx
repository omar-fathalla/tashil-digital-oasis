
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { EmployeeRequest } from "@/hooks/useEmployeeRequests";

// Define document type locally
interface EmployeeDocumentType {
  id: string;
  employee_id: string;
  document_type: string;
  file_url: string;
  uploaded_at: string;
  verified: boolean;
  verification_date?: string;
  notes?: string;
}

// Define digital ID type locally
interface DigitalIDType {
  id: string;
  employee_id: string;
  id_number: string;
  issue_date: string;
  expiry_date: string;
  status: string;
}

interface RequestDetailsSheetProps {
  request: EmployeeRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestDetailsSheet({ request, open, onOpenChange }: RequestDetailsSheetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [digitalId, setDigitalId] = useState<any>(null);

  useEffect(() => {
    // Fetch additional data when a request is opened
    if (request && open) {
      const fetchAdditionalData = async () => {
        setIsLoading(true);
        try {
          // For documents and digital IDs, we'll check the registration_requests table
          // which has these fields as JSON columns
          const { data: requestData, error: requestError } = await supabase
            .from('registration_requests')
            .select('documents')
            .eq('id', request.id)
            .single();
            
          if (requestError && !requestError.message.includes('not found')) {
            throw requestError;
          }
          
          // Process documents
          if (requestData?.documents) {
            const docsArray = [];
            for (const [key, url] of Object.entries(requestData.documents)) {
              if (typeof url === 'string') {
                docsArray.push({
                  id: `${request.id}-${key}`,
                  employee_id: request.id,
                  document_type: key.replace(/_/g, ' '),
                  file_url: url,
                  uploaded_at: new Date().toISOString(),
                  verified: request.status === 'approved'
                });
              }
            }
            setDocuments(docsArray);
          } else {
            setDocuments([]);
          }
          
          // For approved requests, check for digital ID info
          // In a real app, you'd query a digital_ids table
          if (request.status === 'approved') {
            // This is simplified logic - in a real app, you'd fetch from your digital_ids table
            setDigitalId({
              id_number: `ID-${request.id.substring(0, 8)}`,
              issue_date: new Date().toISOString(),
              expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
            });
          } else {
            setDigitalId(null);
          }
        } catch (error) {
          console.error("Error fetching additional request data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchAdditionalData();
    }
  }, [request, open]);

  if (!request) return null;

  const isCompanyRequest = request.type === "company";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Request Details</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            {isCompanyRequest ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Company Name</p>
                  <p className="font-medium">{request.company_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company Number</p>
                  <p className="font-medium font-mono">{request.company_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax Card Number</p>
                  <p className="font-medium">{request.tax_card_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Commercial Register</p>
                  <p className="font-medium">{request.commercial_register_number}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Employee Name</p>
                  <p className="font-medium">{request.employee_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employee ID</p>
                  <p className="font-medium font-mono">{request.employee_id}</p>
                </div>
              </>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Request Type</p>
              <p className="font-medium">{request.request_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                variant="outline"
                className={
                  request.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : request.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }
              >
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </div>
          </div>

          {request.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="font-medium mt-1 text-sm">{request.notes}</p>
            </div>
          )}
          
          {/* Documents Section */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Documents</h3>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm capitalize">
                        {doc.document_type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={doc.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm" className="h-8 px-3">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No documents available</p>
            )}
          </div>
          
          {/* Digital ID Section */}
          {request.status === "approved" && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Digital ID</h3>
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : digitalId ? (
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">ID Number</p>
                      <p className="font-medium">{digitalId.id_number}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Issue Date</p>
                      <p className="text-sm">
                        {new Date(digitalId.issue_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Expiry Date</p>
                      <p className="text-sm">
                        {new Date(digitalId.expiry_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="default" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download ID Card
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Digital ID not generated yet
                </p>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
