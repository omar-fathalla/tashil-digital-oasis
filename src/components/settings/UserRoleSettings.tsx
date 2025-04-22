
import { useState } from "react";
import { Plus, Edit, Trash2, Search, Filter, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

// Define types
interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
}

interface Permission {
  id: string;
  key: string;
  name: string;
}

// Form schema for validation
const roleFormSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
  description: z.string(),
  permissions: z.array(z.string()),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

export const UserRoleSettings = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "System Admin",
      description: "Full system administrator with all permissions",
      userCount: 2,
      permissions: ["view_users", "edit_users", "delete_users", "upload_documents", "review_requests", "send_notifications", "manage_company"]
    },
    {
      id: "2",
      name: "HR Manager",
      description: "Can manage employees and requests",
      userCount: 5,
      permissions: ["view_users", "edit_users", "upload_documents", "review_requests"]
    },
    {
      id: "3",
      name: "Editor",
      description: "Can edit and upload documents only",
      userCount: 8,
      permissions: ["upload_documents"]
    }
  ]);

  // Available permissions
  const permissions: Permission[] = [
    { id: "1", key: "view_users", name: "View Users" },
    { id: "2", key: "edit_users", name: "Edit Users" },
    { id: "3", key: "delete_users", name: "Delete Users" },
    { id: "4", key: "upload_documents", name: "Upload Documents" },
    { id: "5", key: "review_requests", name: "Review Requests" },
    { id: "6", key: "send_notifications", name: "Send Notifications" },
    { id: "7", key: "manage_company", name: "Manage Company" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddRoleModal = () => {
    form.reset({
      name: "",
      description: "",
      permissions: [],
    });
    setCurrentRole(null);
    setIsRoleModalOpen(true);
  };

  const openEditRoleModal = (role: Role) => {
    form.reset({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setCurrentRole(role);
    setIsRoleModalOpen(true);
  };

  const openDeleteDialog = (role: Role) => {
    setCurrentRole(role);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = (values: RoleFormValues) => {
    if (currentRole) {
      // Edit existing role
      const updatedRoles = roles.map(role => 
        role.id === currentRole.id 
          ? { ...role, ...values } 
          : role
      );
      setRoles(updatedRoles);
      toast({
        title: "Role Updated",
        description: `The role "${values.name}" has been updated successfully.`,
      });
    } else {
      // Add new role
      const newRole: Role = {
        id: `${Date.now()}`, // Simple ID generation for demo
        name: values.name,
        description: values.description,
        userCount: 0,
        permissions: values.permissions,
      };
      setRoles([...roles, newRole]);
      toast({
        title: "Role Created",
        description: `The role "${values.name}" has been created successfully.`,
      });
    }
    setIsRoleModalOpen(false);
  };

  const handleDeleteRole = () => {
    if (currentRole) {
      const updatedRoles = roles.filter(role => role.id !== currentRole.id);
      setRoles(updatedRoles);
      toast({
        title: "Role Deleted",
        description: `The role "${currentRole.name}" has been deleted successfully.`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const getPermissionName = (key: string) => {
    const permission = permissions.find(p => p.key === key);
    return permission ? permission.name : key;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">User Role Management</h2>
        <p className="text-muted-foreground">
          Define user roles and assign permissions to control access to system features.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        <Button onClick={openAddRoleModal}>
          <Plus className="mr-1 h-4 w-4" /> Add Role
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Users</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.length > 0 ? (
                      role.permissions.slice(0, 2).map((permission) => (
                        <Badge key={permission} variant="outline" className="bg-primary/10">
                          {getPermissionName(permission)}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">No permissions</span>
                    )}
                    {role.permissions.length > 2 && (
                      <Badge variant="outline" className="bg-muted">
                        +{role.permissions.length - 2} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{role.userCount}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditRoleModal(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openDeleteDialog(role)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredRoles.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No roles found matching your search criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Role Modal */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentRole ? "Edit Role" : "Add New Role"}</DialogTitle>
            <DialogDescription>
              {currentRole 
                ? "Update the role details and permissions below." 
                : "Create a new role and assign permissions."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter role name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the purpose of this role" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Permissions
                </h4>
                <div className="border rounded-md p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {permissions.map((permission) => (
                      <FormField
                        key={permission.id}
                        control={form.control}
                        name="permissions"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(permission.key)}
                                onCheckedChange={(checked) => {
                                  const updatedPermissions = checked
                                    ? [...field.value, permission.key]
                                    : field.value.filter((value) => value !== permission.key);
                                  field.onChange(updatedPermissions);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {permission.name}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">
                  {currentRole ? "Update Role" : "Create Role"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the role "{currentRole?.name}".
              {currentRole && currentRole.userCount > 0 && (
                <span className="block mt-2 font-medium text-destructive">
                  Warning: This role has {currentRole.userCount} users assigned to it.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRole} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
