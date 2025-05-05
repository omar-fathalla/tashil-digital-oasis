
import { useCallback, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Document, 
  DocumentCategory, 
  DocumentSearchFilters, 
  DocumentVersion,
  documentApi 
} from "@/utils/document";
import { useToast } from "./use-toast";

export const useDocuments = (filters?: DocumentSearchFilters) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchFilters, setSearchFilters] = useState<DocumentSearchFilters>(filters || {});

  // Query for fetching documents
  const {
    data: documents = [],
    isLoading: isLoadingDocuments,
    isError: isErrorDocuments,
    error: documentsError,
    refetch: refetchDocuments,
  } = useQuery({
    queryKey: ['documents', searchFilters],
    queryFn: async () => {
      const result = await documentApi.getDocuments(searchFilters);
      
      // If no documents returned, generate sample data
      if (result.length === 0) {
        console.log("No documents found, returning sample data");
        return generateSampleDocuments();
      }
      
      return result;
    },
  });

  // Query for fetching categories
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ['document-categories'],
    queryFn: async () => {
      const result = await documentApi.getCategories();
      
      // If no categories returned, generate sample data
      if (result.length === 0) {
        console.log("No categories found, returning sample categories");
        return generateSampleCategories();
      }
      
      return result;
    },
  });

  // Generate sample documents for demo purposes
  const generateSampleDocuments = (): Document[] => {
    const sampleCategories = generateSampleCategories();
    const fileTypes = ['application/pdf', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    return Array(12).fill(null).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      const categoryIndex = Math.floor(Math.random() * sampleCategories.length);
      
      return {
        id: `sample-doc-${index}`,
        name: getSampleDocumentName(index),
        description: `Sample document description for ${getSampleDocumentName(index)}`,
        file_url: `https://example.com/documents/sample-${index}.pdf`,
        file_type: fileTypes[Math.floor(Math.random() * fileTypes.length)],
        file_size: Math.floor(Math.random() * 1000000) + 100000, // 100KB to 1MB
        category_id: sampleCategories[categoryIndex].id,
        uploaded_by: 'sample-user',
        created_at: date.toISOString(),
        updated_at: date.toISOString(),
        is_encrypted: Math.random() > 0.8,
        metadata: {
          originalName: `original-${getSampleDocumentName(index)}.pdf`,
          lastModified: date.getTime(),
        },
        keywords: getSampleKeywords()
      };
    });
  };

  // Generate sample categories
  const generateSampleCategories = (): DocumentCategory[] => {
    const categories = [
      { name: 'Human Resources', description: 'Employee-related documents' },
      { name: 'Finance', description: 'Financial documents and reports' },
      { name: 'Legal', description: 'Contracts and legal documents' },
      { name: 'Operations', description: 'Operational manuals and guides' },
      { name: 'Marketing', description: 'Marketing materials and assets' }
    ];
    
    return categories.map((category, index) => ({
      id: `sample-category-${index}`,
      name: category.name,
      description: category.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
  };

  // Helper function to get sample document names
  const getSampleDocumentName = (index: number): string => {
    const documentNames = [
      'Employee Handbook', 'Privacy Policy', 'Company Bylaws', 
      'Annual Report', 'Financial Statement', 'Project Proposal',
      'Marketing Strategy', 'Customer Analysis', 'Technical Documentation',
      'Training Manual', 'Meeting Minutes', 'Product Specifications',
      'Compliance Report', 'Health and Safety Guidelines', 'Research Report'
    ];
    
    return documentNames[index % documentNames.length];
  };
  
  // Helper function to get sample keywords
  const getSampleKeywords = (): string[] => {
    const allKeywords = ['confidential', 'important', 'draft', 'final', 'approved', 'pending', 'template', 'reference'];
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 keywords
    const keywords: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomKeyword = allKeywords[Math.floor(Math.random() * allKeywords.length)];
      if (!keywords.includes(randomKeyword)) {
        keywords.push(randomKeyword);
      }
    }
    
    return keywords;
  };

  // Mutation for uploading a document
  const uploadMutation = useMutation({
    mutationFn: (params: {
      file: File;
      name: string;
      description?: string;
      categoryId?: string;
      keywords?: string[];
      isEncrypted?: boolean;
    }) => documentApi.uploadDocument(
      params.file,
      params.name,
      params.description,
      params.categoryId,
      params.keywords,
      params.isEncrypted
    ),
    onSuccess: () => {
      toast({
        title: 'Document uploaded',
        description: 'Your document has been uploaded successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload document',
        variant: 'destructive',
      });
    },
  });

  // Mutation for deleting a document
  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentApi.deleteDocument(id),
    onSuccess: () => {
      toast({
        title: 'Document deleted',
        description: 'The document has been deleted successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete document',
        variant: 'destructive',
      });
    },
  });

  // Mutation for updating a document
  const updateMutation = useMutation({
    mutationFn: (params: { 
      id: string; 
      updates: {
        name?: string;
        description?: string;
        categoryId?: string;
        keywords?: string[];
      }
    }) => documentApi.updateDocument(params.id, params.updates),
    onSuccess: () => {
      toast({
        title: 'Document updated',
        description: 'The document has been updated successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update document',
        variant: 'destructive',
      });
    },
  });

  // Mutation for creating a new version
  const createVersionMutation = useMutation({
    mutationFn: (params: { 
      documentId: string; 
      file: File;
      changeSummary?: string;
    }) => documentApi.uploadNewVersion(
      params.documentId, 
      params.file, 
      params.changeSummary
    ),
    onSuccess: () => {
      toast({
        title: 'New version created',
        description: 'A new version of the document has been created successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['document-versions'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Version creation failed',
        description: error.message || 'Failed to create new version',
        variant: 'destructive',
      });
    },
  });

  // Mutation for creating a category
  const createCategoryMutation = useMutation({
    mutationFn: (params: { name: string; description?: string }) => 
      documentApi.createCategory(params.name, params.description),
    onSuccess: () => {
      toast({
        title: 'Category created',
        description: 'The category has been created successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['document-categories'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Category creation failed',
        description: error.message || 'Failed to create category',
        variant: 'destructive',
      });
    },
  });

  // Function to get document versions
  const getDocumentVersions = useCallback((documentId: string) => {
    return useQuery({
      queryKey: ['document-versions', documentId],
      queryFn: () => documentApi.getDocumentVersions(documentId),
    });
  }, []);

  // Function to get document permissions
  const getDocumentPermissions = useCallback((documentId: string) => {
    return useQuery({
      queryKey: ['document-permissions', documentId],
      queryFn: () => documentApi.getDocumentPermissions(documentId),
    });
  }, []);

  // Function to update search filters
  const updateSearchFilters = useCallback((newFilters: DocumentSearchFilters) => {
    setSearchFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    documents,
    isLoadingDocuments,
    isErrorDocuments,
    documentsError,
    refetchDocuments,
    categories,
    isLoadingCategories,
    searchFilters,
    updateSearchFilters,
    uploadDocument: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    deleteDocument: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    updateDocument: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    createVersion: createVersionMutation.mutateAsync,
    isCreatingVersion: createVersionMutation.isPending,
    createCategory: createCategoryMutation.mutateAsync,
    isCreatingCategory: createCategoryMutation.isPending,
    getDocumentVersions,
    getDocumentPermissions,
  };
};
