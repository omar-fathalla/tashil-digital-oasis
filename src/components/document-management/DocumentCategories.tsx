
import { useState } from "react";
import { DocumentCategory } from "@/utils/documentApi";
import { useDocuments } from "@/hooks/useDocuments";
import { Folders, Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface DocumentCategoriesProps {
  categories: DocumentCategory[];
  isLoading: boolean;
}

export function DocumentCategories({
  categories,
  isLoading,
}: DocumentCategoriesProps) {
  const { toast } = useToast();
  const { createCategory, isCreatingCategory } = useDocuments();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCategory({
        name: newCategory.name,
        description: newCategory.description || undefined,
      });
      
      setNewCategory({ name: "", description: "" });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Skeleton className="h-5 w-5 mr-2" />
            <Skeleton className="h-5 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-md flex items-center">
            <Folders className="h-5 w-5 mr-2" />
            Document Categories
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No categories yet. Add your first category.
            </p>
          ) : (
            <div className="space-y-1">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="py-2 px-2 hover:bg-accent rounded-md transition-colors flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{category.name}</p>
                    {category.description && (
                      <p className="text-xs text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category for organizing documents.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Name</label>
              <Input
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                placeholder="Enter category description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCategory}
              disabled={isCreatingCategory || !newCategory.name.trim()}
            >
              {isCreatingCategory && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
