
import { useState, useEffect } from "react";
import { Document, DocumentVersion, documentApi } from "@/utils/documentApi";
import { useDocuments } from "@/hooks/useDocuments";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  Trash2,
  History,
  Edit,
  Shield,
  Tag,
  Clock,
  Save,
  Calendar,
  Upload,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentDetailsDialogProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentDetailsDialog({
  document,
  open,
  onOpenChange,
}: DocumentDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedDocument, setEditedDocument] = useState({
    name: document.name,
    description: document.description || "",
    categoryId: document.category_id || "",
    keywords: document.keywords || [],
  });
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [fileForNewVersion, setFileForNewVersion] = useState<File | null>(null);
  const [changeSummary, setChangeSummary] = useState("");
  const [isUploadingVersion, setIsUploadingVersion] = useState(false);

  const {
    categories,
    deleteDocument,
    isDeleting,
    updateDocument,
    isUpdating,
    createVersion,
  } = useDocuments();

  useEffect(() => {
    if (activeTab === "versions" && open) {
      loadVersions();
    }
  }, [activeTab, open, document.id]);

  const loadVersions = async () => {
    setIsLoadingVersions(true);
    try {
      const versions = await documentApi.getDocumentVersions(document.id);
      setVersions(versions);
    } catch (error) {
      console.error("Error loading versions:", error);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const handleDownload = () => {
    window.open(document.file_url, "_blank");
    documentApi.logDocumentAccess(document.id, "download");
  };

  const handleDelete = async () => {
    try {
      await deleteDocument(document.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateDocument({
        id: document.id,
        updates: {
          name: editedDocument.name,
          description: editedDocument.description || undefined,
          categoryId: editedDocument.categoryId || undefined,
          keywords: editedDocument.keywords,
        },
      });
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleVersionDownload = (version: DocumentVersion) => {
    window.open(version.file_url, "_blank");
    documentApi.logDocumentAccess(document.id, "download_version", { 
      version_id: version.id, 
      version_number: version.version_number 
    });
  };

  const handleAddKeyword = () => {
    if (currentKeyword.trim() && !editedDocument.keywords.includes(currentKeyword.trim())) {
      setEditedDocument({
        ...editedDocument,
        keywords: [...editedDocument.keywords, currentKeyword.trim()],
      });
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setEditedDocument({
      ...editedDocument,
      keywords: editedDocument.keywords.filter((k) => k !== keyword),
    });
  };

  const handleNewVersionSubmit = async () => {
    if (!fileForNewVersion) return;

    setIsUploadingVersion(true);
    try {
      await createVersion({
        documentId: document.id,
        file: fileForNewVersion,
        changeSummary,
      });
      
      setFileForNewVersion(null);
      setChangeSummary("");
      loadVersions();
    } catch (error) {
      console.error("Error creating new version:", error);
    } finally {
      setIsUploadingVersion(false);
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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              {isEditMode ? "Edit Document" : document.name}
            </DialogTitle>
            <DialogDescription>
              {document.description || "View and manage document details"}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="versions">Version History</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 py-4">
              {isEditMode ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Document Name</Label>
                    <Input
                      id="name"
                      value={editedDocument.name}
                      onChange={(e) =>
                        setEditedDocument({
                          ...editedDocument,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editedDocument.description}
                      onChange={(e) =>
                        setEditedDocument({
                          ...editedDocument,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={editedDocument.categoryId}
                      onValueChange={(value) =>
                        setEditedDocument({
                          ...editedDocument,
                          categoryId: value,
                        })
                      }
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="keywords">Keywords</Label>
                    <div className="flex gap-2">
                      <Input
                        id="keywords"
                        value={currentKeyword}
                        onChange={(e) => setCurrentKeyword(e.target.value)}
                        placeholder="Enter keywords for search"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddKeyword();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleAddKeyword}
                        disabled={!currentKeyword.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    {editedDocument.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {editedDocument.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                            <button
                              type="button"
                              className="ml-1"
                              onClick={() => removeKeyword(keyword)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-4 w-4 mr-2" /> Created
                      </p>
                      <p className="font-medium">
                        {format(new Date(document.created_at), "PPP p")}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-4 w-4 mr-2" /> Last Modified
                      </p>
                      <p className="font-medium">
                        {format(new Date(document.updated_at), "PPP p")}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">File Type</p>
                      <p className="font-medium">
                        {document.file_type.split('/')[1] || document.file_type}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">File Size</p>
                      <p className="font-medium">
                        {formatFileSize(document.file_size)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Tag className="h-4 w-4 mr-2" /> Category
                      </p>
                      <p className="font-medium">
                        {categories.find(
                          (c) => c.id === document.category_id
                        )?.name || "Uncategorized"}
                      </p>
                    </div>

                    {document.is_encrypted && (
                      <div>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Shield className="h-4 w-4 mr-2" /> Security
                        </p>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Encrypted
                        </Badge>
                      </div>
                    )}
                  </div>

                  {document.description && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-1">Description</p>
                      <p>{document.description}</p>
                    </div>
                  )}

                  {document.keywords && document.keywords.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-1">Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {document.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="versions" className="space-y-4 py-4">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Upload a new version of this document
                </p>
                <div className="flex flex-col space-y-4">
                  <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="file"
                      id="version-file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFileForNewVersion(e.target.files[0]);
                        }
                      }}
                    />
                    {fileForNewVersion ? (
                      <div className="flex flex-col items-center">
                        <FileText className="h-8 w-8 text-green-500 mb-2" />
                        <p className="font-medium">{fileForNewVersion.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(fileForNewVersion.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setFileForNewVersion(null)}
                        >
                          <X className="h-4 w-4 mr-1" /> Change File
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="version-file"
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="font-medium">Click to upload a new version</p>
                        <p className="text-sm text-muted-foreground">
                          Upload an updated version of this document
                        </p>
                      </label>
                    )}
                  </div>

                  {fileForNewVersion && (
                    <>
                      <div>
                        <Label htmlFor="change-summary">Change Summary</Label>
                        <Textarea
                          id="change-summary"
                          value={changeSummary}
                          onChange={(e) => setChangeSummary(e.target.value)}
                          placeholder="Briefly describe what changed in this version"
                          rows={2}
                        />
                      </div>
                      <Button
                        onClick={handleNewVersionSubmit}
                        disabled={isUploadingVersion}
                      >
                        {isUploadingVersion ? "Uploading..." : "Upload New Version"}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Version History</h3>
                {isLoadingVersions ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : versions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No previous versions found
                  </p>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Version</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Changes</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {versions.map((version) => (
                          <TableRow key={version.id}>
                            <TableCell>v{version.version_number}</TableCell>
                            <TableCell>
                              {format(new Date(version.created_at), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>{formatFileSize(version.file_size)}</TableCell>
                            <TableCell>
                              {version.change_summary || "No description"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleVersionDownload(version)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4 py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Access Control</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage which roles can access this document
                  </p>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead>View</TableHead>
                        <TableHead>Edit</TableHead>
                        <TableHead>Delete</TableHead>
                        <TableHead>Share</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Admin</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Yes
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Yes
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Yes
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Yes
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Manager</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Yes
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Yes
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                            No
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Yes
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">User</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Yes
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                            No
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                            No
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                            No
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Access Logs</h3>
                  <p className="text-sm text-muted-foreground">
                    Recent activity for this document
                  </p>

                  <div className="border rounded-md p-4 mt-2 space-y-3">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-muted-foreground">
                          Viewed document - {format(new Date(), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            {isEditMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditMode(false);
                    setEditedDocument({
                      name: document.name,
                      description: document.description || "",
                      categoryId: document.category_id || "",
                      keywords: document.keywords || [],
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} disabled={isUpdating}>
                  <Save className="mr-2 h-4 w-4" />
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <>
                <div className="flex-1 flex gap-2 justify-start">
                  <Button
                    variant="destructive"
                    onClick={() => setIsConfirmDeleteOpen(true)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
                <div className="flex gap-2">
                  {activeTab === "details" && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditMode(true)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}
                  <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the document "{document.name}" and all its
              versions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
