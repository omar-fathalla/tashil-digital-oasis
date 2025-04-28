
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Company } from "@/hooks/useCompanies";
import { format } from "date-fns";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseCard } from "@/components/ui/card-layout/BaseCard";

interface CompanyDetailsDialogProps {
  company: Company | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompanyDetailsDialog({ company, open, onOpenChange }: CompanyDetailsDialogProps) {
  if (!company) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPP");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Company Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                <p className="text-lg font-medium">{company.company_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p>{company.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tax Card Number</label>
                <p>{company.tax_card_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Register Number</label>
                <p>{company.register_number}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company Number</label>
                <p>{company.company_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                <p>{formatDate(company.created_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p>{formatDate(company.updated_at)}</p>
              </div>
              {company.is_dummy && (
                <div className="mt-2">
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Demo Company</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium">Documents</h3>
            <div className="flex flex-wrap gap-4">
              {company.commercial_register_url && (
                <a 
                  href={company.commercial_register_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-accent p-3 rounded-md hover:bg-accent/80 transition-colors"
                >
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Commercial Register</div>
                    <div className="text-xs text-muted-foreground">View document</div>
                  </div>
                  <Download className="h-4 w-4 ml-2" />
                </a>
              )}
              
              {company.tax_card_url && (
                <a 
                  href={company.tax_card_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-accent p-3 rounded-md hover:bg-accent/80 transition-colors"
                >
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Tax Card</div>
                    <div className="text-xs text-muted-foreground">View document</div>
                  </div>
                  <Download className="h-4 w-4 ml-2" />
                </a>
              )}
              
              {!company.commercial_register_url && !company.tax_card_url && (
                <p className="text-muted-foreground">No documents available</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
