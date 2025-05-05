
// This file is deprecated and will be removed.
// Use imports from the new structure instead.
import { documentApi, DocumentType, DocumentTypes, Document, DocumentVersion, DocumentCategory, DocumentPermission, DocumentSearchFilters, Role } from './document';
import { useDocumentApi } from './document/hooks/useDocumentApi';

export {
  documentApi,
  DocumentType,
  DocumentTypes,
  useDocumentApi
};

export type {
  Document, 
  DocumentVersion, 
  DocumentCategory, 
  DocumentPermission, 
  DocumentSearchFilters,
  Role
};
