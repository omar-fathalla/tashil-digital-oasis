
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Company } from "@/hooks/useCompanies";
import { format } from "date-fns";
import { FileText, Download, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useState } from "react";
import { useCompanies } from "@/hooks/useCompanies";

interface CompanyDetailsDialogProps {
  company: Company | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompanyDetailsDialog({ company, open, onOpenChange }: CompanyDetailsDialogProps) {
  const { user } = useAuth();
  const { deleteCompany } = useCompanies();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!company) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPP");
  };

  const canManageCompany = user?.role === 'admin' || user?.role === 'manager';

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCompany.mutateAsync(company.id);
      toast.success("Company deleted successfully");
      onOpenChange(false);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete company");
      console.error("Error deleting company:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = (url: string | null, documentType: string) => {
    if (!url) {
      toast.error(`No ${documentType} available`);
      return;
    }
    window.open(url, '_blank');
  };

  return (
    <>
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
                  <button 
                    onClick={() => handleDownload(company.commercial_register_url, "Commercial Register")}
                    className="flex items-center gap-2 bg-accent p-3 rounded-md hover:bg-accent/80 transition-colors"
                  >
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Commercial Register</div>
                      <div className="text-xs text-muted-foreground">View document</div>
                    </div>
                    <Download className="h-4 w-4 ml-2" />
                  </button>
                )}
              
                {company.tax_card_url && (
                  <button 
                    onClick={() => handleDownload(company.tax_card_url, "Tax Card")}
                    className="flex items-center gap-2 bg-accent p-3 rounded-md hover:bg-accent/80 transition-colors"
                  >
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Tax Card</div>
                      <div className="text-xs text-muted-foreground">View document</div>
                    </div>
                    <Download className="h-4 w-4 ml-2" />
                  </button>
                )}
              
                {!company.commercial_register_url && !company.tax_card_url && (
                  <p className="text-muted-foreground">No documents available</p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex gap-2">
                {canManageCompany && (
                  <>
                    <Button variant="outline" onClick={() => toast.info("Edit functionality coming soon")}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => setIsDeleteDialogOpen(true)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </>
                )}
              </div>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the company 
              <strong className="font-semibold ml-1">
                {company.company_name}
              </strong> and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Company"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

