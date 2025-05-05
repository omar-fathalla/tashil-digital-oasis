
import { documentCrudApi } from "./document-crud";
import { documentVersionsApi } from "./document-versions";
import { documentCategoriesApi } from "./document-categories";
import { documentPermissionsApi } from "./document-permissions";
import { documentLoggingApi } from "./document-logging";
import { Document, DocumentCategory, DocumentPermission, DocumentSearchFilters, DocumentVersion, DocumentType, Role } from "../types";
import { DOCUMENTS_BUCKET } from "../constants";

// Export all types
export type {
  Document,
  DocumentVersion,
  DocumentCategory,
  DocumentPermission,
  DocumentSearchFilters,
  DocumentType,
  Role
};

// Export constants
export { DOCUMENTS_BUCKET };

// Combine all API modules into a single documentApi object
export const documentApi = {
  ...documentCrudApi,
  ...documentVersionsApi,
  ...documentCategoriesApi,
  ...documentPermissionsApi,
  ...documentLoggingApi
};
