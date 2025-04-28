
import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Document, 
  DocumentCategory, 
  DocumentSearchFilters, 
  DocumentVersion,
  documentApi 
} from "@/utils/documentApi";
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
    queryFn: () => documentApi.getDocuments(searchFilters),
  });

  // Query for fetching categories
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ['document-categories'],
    queryFn: documentApi.getCategories,
  });

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
