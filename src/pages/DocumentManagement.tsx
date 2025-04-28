import { useState } from "react";
import { useDocuments } from "@/hooks/useDocuments";
import { DocumentCategories } from "@/components/document-management/DocumentCategories";
import { DocumentList } from "@/components/document-management/DocumentList";
import { DocumentSearch } from "@/components/document-management/DocumentSearch";
import { DocumentUpload } from "@/components/document-management/DocumentUpload";
import { DocumentActions } from "@/components/document-management/DocumentActions";
import { DocumentDetailsDialog } from "@/components/document-management/DocumentDetailsDialog";
import { Document, DocumentSearchFilters } from "@/utils/documentApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DocumentManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [currentFilters, setCurrentFilters] = useState<DocumentSearchFilters>({});
  
  const { 
    documents,
    isLoadingDocuments,
    categories,
    isLoadingCategories,
    updateSearchFilters,
  } = useDocuments(currentFilters);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleSearch = (filters: DocumentSearchFilters) => {
    setCurrentFilters(filters);
    updateSearchFilters(filters);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update filters based on tab
    let newFilters: DocumentSearchFilters = {};
    
    if (value === "recent") {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      newFilters = {
        ...currentFilters,
        startDate: lastWeek,
      };
    } else if (value === "my-uploads") {
      newFilters = {
        ...currentFilters,
        uploadedBy: user.id,
      };
    } else if (value !== "all") {
      // If it's a category ID
      newFilters = {
        ...currentFilters,
        categoryId: value,
      };
    }
    
    setCurrentFilters(newFilters);
    updateSearchFilters(newFilters);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Document Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage, organize and securely share your documents
            </p>
          </div>
          <Button 
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} /> Upload Document
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Document Repository</CardTitle>
            <CardDescription>
              Search, view and manage all your documents from a single place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <DocumentSearch onSearch={handleSearch} categories={categories} />
            </div>
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <div className="flex overflow-auto pb-2">
                <TabsList className="mb-4 flex-nowrap">
                  <TabsTrigger value="all">All Documents</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="my-uploads">My Uploads</TabsTrigger>
                  
                  {isLoadingCategories ? (
                    <div className="flex items-center px-4">
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ) : (
                    categories.slice(0, 3).map(category => (
                      <TabsTrigger key={category.id} value={category.id}>
                        {category.name}
                      </TabsTrigger>
                    ))
                  )}
                  
                  {categories.length > 3 && (
                    <TabsTrigger value="more-categories">More...</TabsTrigger>
                  )}
                </TabsList>
              </div>
              
              <TabsContent value={activeTab} className="mt-0">
                <DocumentList 
                  documents={documents}
                  isLoading={isLoadingDocuments}
                  onDocumentSelect={setSelectedDocument}
                />
              </TabsContent>
              
              {/* Other tabs automatically handled by the onChange event */}
            </Tabs>
          </CardContent>
        </Card>

        {/* Document Management Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DocumentActions />
          <DocumentCategories categories={categories} isLoading={isLoadingCategories} />
        </div>
      </div>
      
      {/* Document Upload Dialog */}
      <DocumentUpload 
        open={showUpload}
        onOpenChange={setShowUpload}
        categories={categories}
      />
      
      {/* Document Details Dialog */}
      {selectedDocument && (
        <DocumentDetailsDialog
          document={selectedDocument}
          open={!!selectedDocument}
          onOpenChange={(open) => !open && setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

export default DocumentManagement;
