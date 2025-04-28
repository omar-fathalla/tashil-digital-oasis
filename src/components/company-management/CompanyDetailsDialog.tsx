
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Company } from "@/hooks/useCompanies";
import { format } from "date-fns";
import { FileText, Download, Edit, Trash2, Save, X, AlertTriangle, Check } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useCompanies } from "@/hooks/useCompanies";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

// Define validation schema for company edits
const companyFormSchema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  address: z.string().min(3, "Address is required"),
  company_number: z.string().min(1, "Company number is required"),
  tax_card_number: z.string().min(1, "Tax card number is required"),
  register_number: z.string().min(1, "Register number is required"),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

interface CompanyDetailsDialogProps {
  company: Company | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompanyDetailsDialog({ company, open, onOpenChange }: CompanyDetailsDialogProps) {
  const { user } = useAuth();
  const { deleteCompany, updateCompany } = useCompanies();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  // Initialize form with default empty values
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      company_name: "",
      address: "",
      company_number: "",
      tax_card_number: "",
      register_number: "",
    },
  });
  
  // Update form values when company changes
  useEffect(() => {
    if (company) {
      form.reset({
        company_name: company.company_name,
        address: company.address,
        company_number: company.company_number,
        tax_card_number: company.tax_card_number,
        register_number: company.register_number,
      });
    }
  }, [company, form]);

  if (!company) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPP");
  };

  const canManageCompany = user?.role === 'admin' || user?.role === 'manager';

  const onSubmit = async (values: CompanyFormValues) => {
    try {
      await updateCompany.mutateAsync({
        id: company.id,
        company_name: values.company_name,
        address: values.address,
        company_number: values.company_number,
        tax_card_number: values.tax_card_number,
        register_number: values.register_number,
      });
      toast.success("Company updated successfully");
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company", { 
        description: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCompany.mutateAsync(company.id);
      toast.success("Company deleted successfully");
      onOpenChange(false);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete company", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
      console.error("Error deleting company:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async (url: string | null, documentType: string) => {
    if (!url) {
      toast.error(`No ${documentType} available`);
      return;
    }

    setIsDownloading(documentType);
    try {
      window.open(url, '_blank');
      toast.success(`${documentType} opened successfully`);
    } catch (error) {
      toast.error(`Failed to open ${documentType}`, { 
        description: "The file might be unavailable or restricted"
      });
      console.error(`Error downloading ${documentType}:`, error);
    } finally {
      setTimeout(() => setIsDownloading(null), 1000); // Small delay for UX
    }
  };

  const cancelEdit = () => {
    // Reset form to original values
    form.reset({
      company_name: company.company_name,
      address: company.address,
      company_number: company.company_number,
      tax_card_number: company.tax_card_number,
      register_number: company.register_number,
    });
    setIsEditMode(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(newOpen) => {
        if (!isEditMode || !newOpen) {
          onOpenChange(newOpen); 
        } else {
          // Show confirmation before closing in edit mode
          const confirmed = window.confirm("You have unsaved changes. Are you sure you want to close?");
          if (confirmed) {
            cancelEdit();
            onOpenChange(newOpen);
          }
        }
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center">
                {isEditMode ? "Edit Company Details" : "Company Details"}
                {company.is_dummy && (
                  <Badge variant="outline" className="ml-3 bg-amber-100 text-amber-800 border-amber-200">
                    Demo Company
                  </Badge>
                )}
              </DialogTitle>
              {canManageCompany && !isEditMode && (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Spinner className="h-4 w-4 mr-2" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </DialogHeader>

          {isEditMode ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                
                  <FormField
                    control={form.control}
                    name="company_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="register_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Register Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter register number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tax_card_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Card Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter tax card number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter company address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    <X className="h-4 w-4 mr-2" /> Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updateCompany.isPending || !form.formState.isDirty}
                  >
                    {updateCompany.isPending ? (
                      <>
                        <Spinner className="h-4 w-4 mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
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
                </div>
              </div>
            
              <div className="space-y-3">
                <h3 className="font-medium">Documents</h3>
                <div className="flex flex-wrap gap-4">
                  {company.commercial_register_url ? (
                    <button 
                      onClick={() => handleDownload(company.commercial_register_url, "Commercial Register")}
                      disabled={isDownloading === "Commercial Register"}
                      className="flex items-center gap-2 bg-accent p-3 rounded-md hover:bg-accent/80 transition-colors disabled:opacity-70"
                    >
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Commercial Register</div>
                        <div className="text-xs text-muted-foreground">View document</div>
                      </div>
                      {isDownloading === "Commercial Register" ? (
                        <Spinner className="h-4 w-4 ml-2" />
                      ) : (
                        <Download className="h-4 w-4 ml-2" />
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-muted p-3 rounded-md opacity-70">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Commercial Register</div>
                        <div className="text-xs text-muted-foreground">Not available</div>
                      </div>
                      <AlertTriangle className="h-4 w-4 ml-2 text-amber-500" />
                    </div>
                  )}
                
                  {company.tax_card_url ? (
                    <button 
                      onClick={() => handleDownload(company.tax_card_url, "Tax Card")}
                      disabled={isDownloading === "Tax Card"}
                      className="flex items-center gap-2 bg-accent p-3 rounded-md hover:bg-accent/80 transition-colors disabled:opacity-70"
                    >
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Tax Card</div>
                        <div className="text-xs text-muted-foreground">View document</div>
                      </div>
                      {isDownloading === "Tax Card" ? (
                        <Spinner className="h-4 w-4 ml-2" />
                      ) : (
                        <Download className="h-4 w-4 ml-2" />
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-muted p-3 rounded-md opacity-70">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Tax Card</div>
                        <div className="text-xs text-muted-foreground">Not available</div>
                      </div>
                      <AlertTriangle className="h-4 w-4 ml-2 text-amber-500" />
                    </div>
                  )}
                
                  {!company.commercial_register_url && !company.tax_card_url && (
                    <p className="text-muted-foreground flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" /> 
                      No documents available for this company
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end items-center pt-4 border-t">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
              Delete Company?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the company 
              <strong className="font-semibold ml-1">
                {company.company_name}
              </strong> and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Spinner className="h-4 w-4 mr-2" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Company
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
