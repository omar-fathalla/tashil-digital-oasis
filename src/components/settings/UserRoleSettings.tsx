
import { useState } from "react";
import { Plus, Edit, Trash2, Search, Filter, Shield, Save } from "lucide-react";
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
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useRoleManagement } from "@/hooks/useRoleManagement";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const roleFormSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
  description: z.string(),
  permissions: z.array(z.string()),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

export const UserRoleSettings = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<{ id: string; name: string; description: string; permissions: string[]; userCount: number } | null>(null);

  const { 
    permissions, 
    roles, 
    users,
    isLoading, 
    createRole, 
    updateRole, 
    deleteRole,
    assignUserRole 
  } = useRoleManagement();

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

  const openEditRoleModal = (role: { id: string; name: string; description: string; permissions: string[]; userCount: number }) => {
    form.reset({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setCurrentRole(role);
    setIsRoleModalOpen(true);
  };

  const openDeleteDialog = (role: { id: string; name: string; description: string; permissions: string[]; userCount: number }) => {
    setCurrentRole(role);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = (values: RoleFormValues) => {
    if (currentRole) {
      updateRole.mutate({
        id: currentRole.id,
        name: values.name,
        description: values.description,
        permissions: values.permissions
      });
    } else {
      createRole.mutate({
        name: values.name,
        description: values.description,
        permissions: values.permissions
      });
    }
    setIsRoleModalOpen(false);
  };

  const handleDeleteRole = () => {
    if (currentRole) {
      deleteRole.mutate(currentRole.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const getPermissionName = (key: string) => {
    const permission = permissions.find(p => p.key === key);
    return permission ? permission.name : key;
  };

  const handleRoleChange = (userId: string, roleId: string) => {
    assignUserRole.mutate({ userId, roleId });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Settings Saved",
      description: "User role assignments have been updated successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-16 w-full" />
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-[250px]" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Role Management</h2>
        <p className="text-muted-foreground">
          Define and manage roles with specific permissions to control access to system features.
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

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">System Roles</h3>
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
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">User Role Assignment</h2>
        <p className="text-muted-foreground mb-6">
          Assign or modify roles for individual users in the system.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.user_roles && user.user_roles.length > 0 ? user.user_roles[0].role_id : ""}
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveChanges} className="gap-2">
          <Save className="h-4 w-4" />
          Save Role Assignments
        </Button>
      </div>

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
                <Button 
                  type="submit" 
                  disabled={createRole.isPending || updateRole.isPending}
                >
                  {currentRole ? "Update Role" : "Create Role"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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
            <AlertDialogAction 
              onClick={handleDeleteRole} 
              className="bg-destructive"
              disabled={deleteRole.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
