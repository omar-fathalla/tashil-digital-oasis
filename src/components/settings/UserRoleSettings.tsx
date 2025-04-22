
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
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Form schema for validation
const roleFormSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters"),
  description: z.string(),
  permissions: z.array(z.string()),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

export const UserRoleSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  interface Role {
    id: string;
    name: string;
    description: string;
    created_at: string;
    _count?: {
      users: number;
    };
  }

  interface Permission {
    id: string;
    key: string;
    name: string;
  }

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  // Fetch roles
  const { data: roles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select(`
          *,
          _count: users(count)
        `);

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch permissions
  const { data: permissions = [], isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*');

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch role permissions
  const { data: rolePermissions = [], isLoading: isLoadingRolePermissions } = useQuery({
    queryKey: ['role_permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*');

      if (error) throw error;
      return data || [];
    },
  });

  const createRole = useMutation({
    mutationFn: async (values: RoleFormValues) => {
      // Insert new role
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .insert([
          { name: values.name, description: values.description }
        ])
        .select()
        .single();

      if (roleError) throw roleError;

      // Insert role permissions
      if (values.permissions.length > 0) {
        const rolePermissions = values.permissions.map(permissionId => ({
          role_id: roleData.id,
          permission_id: permissionId
        }));

        const { error: permError } = await supabase
          .from('role_permissions')
          .insert(rolePermissions);

        if (permError) throw permError;
      }

      return roleData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role_permissions'] });
      setIsRoleModalOpen(false);
      toast({
        title: "Role Created",
        description: "The role has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create role. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateRole = useMutation({
    mutationFn: async (values: RoleFormValues & { id: string }) => {
      // Update role
      const { error: roleError } = await supabase
        .from('roles')
        .update({ 
          name: values.name, 
          description: values.description 
        })
        .eq('id', values.id);

      if (roleError) throw roleError;

      // Delete existing permissions
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', values.id);

      if (deleteError) throw deleteError;

      // Insert new permissions
      if (values.permissions.length > 0) {
        const rolePermissions = values.permissions.map(permissionId => ({
          role_id: values.id,
          permission_id: permissionId
        }));

        const { error: permError } = await supabase
          .from('role_permissions')
          .insert(rolePermissions);

        if (permError) throw permError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role_permissions'] });
      setIsRoleModalOpen(false);
      toast({
        title: "Role Updated",
        description: "The role has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteRole = useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Role Deleted",
        description: "The role has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete role. Please try again.",
        variant: "destructive",
      });
    }
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
    // Use the rolePermissions data from the query to find the permissions for this role
    const currentRolePermissions = rolePermissions
      .filter(rp => rp.role_id === role.id)
      .map(rp => rp.permission_id);

    form.reset({
      name: role.name,
      description: role.description,
      permissions: currentRolePermissions,
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
      updateRole.mutate({ ...values, id: currentRole.id });
    } else {
      createRole.mutate(values);
    }
  };

  const handleDeleteRole = () => {
    if (currentRole) {
      deleteRole.mutate(currentRole.id);
    }
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
                    {rolePermissions
                      .filter(rp => rp.role_id === role.id)
                      .slice(0, 2)
                      .map((rp) => {
                        const permission = permissions.find(p => p.id === rp.permission_id);
                        return permission ? (
                          <Badge key={permission.id} variant="outline" className="bg-primary/10">
                            {permission.name}
                          </Badge>
                        ) : null;
                      })
                    }
                    {rolePermissions.filter(rp => rp.role_id === role.id).length > 2 && (
                      <Badge variant="outline" className="bg-muted">
                        +{rolePermissions.filter(rp => rp.role_id === role.id).length - 2} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{role._count?.users || 0}</Badge>
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
                                checked={field.value?.includes(permission.id)}
                                onCheckedChange={(checked) => {
                                  const updatedPermissions = checked
                                    ? [...field.value, permission.id]
                                    : field.value.filter((value) => value !== permission.id);
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
              {currentRole && currentRole._count?.users > 0 && (
                <span className="block mt-2 font-medium text-destructive">
                  Warning: This role has {currentRole._count.users} users assigned to it.
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
