
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "reviewer" | "support";
}

export const SecuritySettings = () => {
  const { toast } = useToast();
  const [passwordSettings, setPasswordSettings] = useState({
    minLength: "8",
    requireUppercase: true,
    requireNumbers: true,
    requireSpecial: false,
  });
  
  const [enable2FA, setEnable2FA] = useState(false);
  
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    { id: "1", name: "Admin User", email: "admin@example.com", role: "super_admin" },
    { id: "2", name: "Review Manager", email: "reviewer@example.com", role: "admin" },
    { id: "3", name: "Support Agent", email: "support@example.com", role: "support" },
    { id: "4", name: "Document Reviewer", email: "docs@example.com", role: "reviewer" },
  ]);

  const handlePasswordSettingChange = (key: keyof typeof passwordSettings, value: string | boolean) => {
    setPasswordSettings({
      ...passwordSettings,
      [key]: value,
    });
  };

  const handleRoleChange = (userId: string, role: "super_admin" | "admin" | "reviewer" | "support") => {
    setAdminUsers(
      adminUsers.map((user) =>
        user.id === userId ? { ...user, role } : user
      )
    );
    
    toast({
      title: "Role Updated",
      description: `User role has been updated to ${role.replace("_", " ")}.`,
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Success",
      description: "Security settings saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Security & User Roles</h2>
        <p className="text-muted-foreground">
          Configure security settings and manage administrative user roles.
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Password Policy</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">
                Minimum Password Length
              </label>
              <Input
                type="number"
                value={passwordSettings.minLength}
                onChange={(e) => handlePasswordSettingChange("minLength", e.target.value)}
                min="6"
                max="24"
                className="max-w-xs"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Require Uppercase Letters</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Passwords must contain at least one uppercase letter
                </p>
              </div>
              <Switch
                checked={passwordSettings.requireUppercase}
                onCheckedChange={(checked) => 
                  handlePasswordSettingChange("requireUppercase", checked)
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Require Numbers</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Passwords must contain at least one number
                </p>
              </div>
              <Switch
                checked={passwordSettings.requireNumbers}
                onCheckedChange={(checked) => 
                  handlePasswordSettingChange("requireNumbers", checked)
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Require Special Characters</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Passwords must contain at least one special character
                </p>
              </div>
              <Switch
                checked={passwordSettings.requireSpecial}
                onCheckedChange={(checked) => 
                  handlePasswordSettingChange("requireSpecial", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Two-Factor Authentication (2FA)</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Require 2FA for all administrative users
              </p>
            </div>
            <Switch
              checked={enable2FA}
              onCheckedChange={setEnable2FA}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Admin User Roles</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value) => 
                          handleRoleChange(
                            user.id, 
                            value as "super_admin" | "admin" | "reviewer" | "support"
                          )
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="reviewer">Reviewer</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveChanges}>Save Security Settings</Button>
      </div>
    </div>
  );
};
