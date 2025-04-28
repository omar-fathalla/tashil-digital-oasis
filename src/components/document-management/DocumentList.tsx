
import { useState } from "react";
import { Document } from "@/utils/documentApi";
import { FileType } from "lucide-react";
import { FileText, FileImage, FileSpreadsheet, FileArchive, File, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  onDocumentSelect: (document: Document) => void;
}

export function DocumentList({ documents, isLoading, onDocumentSelect }: DocumentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <FileText className="h-4 w-4 text-red-600" />;
    } else if (fileType.includes("image")) {
      return <FileImage className="h-4 w-4 text-blue-600" />;
    } else if (fileType.includes("sheet") || fileType.includes("excel") || fileType.includes("csv")) {
      return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
    } else if (fileType.includes("zip") || fileType.includes("compressed")) {
      return <FileArchive className="h-4 w-4 text-yellow-600" />;
    } else {
      return <File className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes < 1048576) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / 1048576).toFixed(1) + ' MB';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-4 w-32" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-28" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-9 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (filteredDocuments.length === 0) {
    return (
      <div className="text-center py-8">
        <FileType className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold">No documents found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {documents.length === 0 
            ? "Upload your first document to get started" 
            : "Try adjusting your search or filters"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        placeholder="Filter documents by name or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px] w-full">Name</TableHead>
              <TableHead className="min-w-[100px]">Type</TableHead>
              <TableHead className="min-w-[150px]">Size</TableHead>
              <TableHead className="min-w-[150px]">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" /> 
                  Last Modified
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((document) => (
              <TableRow key={document.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {getFileIcon(document.file_type)}
                    <span className="ml-2">{document.name}</span>
                    {document.is_encrypted && (
                      <Badge variant="outline" className="ml-2 border-green-600/30 bg-green-50/30 text-green-600">
                        Encrypted
                      </Badge>
                    )}
                  </div>
                  {document.description && (
                    <p className="text-sm text-muted-foreground mt-1">{document.description}</p>
                  )}
                </TableCell>
                <TableCell>
                  {document.file_type.split('/')[1] || document.file_type}
                </TableCell>
                <TableCell>{formatFileSize(document.file_size)}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(document.updated_at), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDocumentSelect(document)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
