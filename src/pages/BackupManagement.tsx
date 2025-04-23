
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Download, Upload, Trash, Table as TableIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BackupFileUpload } from "@/components/backup/BackupFileUpload";
import { BackupPreviewTable } from "@/components/backup/BackupPreviewTable";
import { supabase } from "@/integrations/supabase/client";

const TABLES = [
  { key: "users", label: "Users" },
  { key: "roles", label: "Roles" },
  { key: "permissions", label: "Permissions" },
];

const getUserPermissions = async (userId: string) => {
  const { data, error } = await supabase.rpc("get_user_permissions", { user_id: userId });
  if (error) return [];
  return data.map((p: any) => p.permission_key);
};

const fetchTableData = async (table: string) => {
  const { data, error } = await supabase.from(table).select("*").limit(1000); // Safety: limit large fetch
  if (error) throw error;
  return data;
};

export default function BackupManagementPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [permissions, setPermissions] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState(TABLES[0].key);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);

  // Uploaded backup file state
  const [backupContent, setBackupContent] = useState<any[] | null>(null);
  const [backupFile, setBackupFile] = useState<File | null>(null);
  const [backupType, setBackupType] = useState<"json" | "csv" | null>(null);

  // Permission check
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    getUserPermissions(user.id).then((p) => setPermissions(p));
  }, [user, navigate]);

  // Only allow access if user has permission
  useEffect(() => {
    if (
      permissions.length > 0 &&
      !permissions.includes("manage_backup")
    ) {
      navigate("/settings");
      toast({
        title: "Permission Denied",
        description: "You do not have permission to access Backup Management.",
        variant: "destructive",
      });
    }
  }, [permissions, navigate]);

  // Fetch data of selected table for download
  useEffect(() => {
    setLoadingTable(true);
    fetchTableData(selectedTable)
      .then((data) => setTableData(data || []))
      .finally(() => setLoadingTable(false));
  }, [selectedTable]);

  // Download JSON
  const handleExport = () => {
    if (!tableData.length) {
      toast({ title: "Nothing to export" });
      return;
    }
    const blob = new Blob([JSON.stringify(tableData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedTable}-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Restore Backup (optionally, clear + insert)
  const handleRestore = async () => {
    if (!backupContent) return;
    const confirmed = window.confirm(
      `Are you sure you want to restore data to "${selectedTable}"? This will replace existing data!`
    );
    if (!confirmed) return;
    try {
      // Delete table data
      const { error: delError } = await supabase.from(selectedTable).delete().neq("id", "");
      if (delError) throw delError;

      // Insert new records (batch)
      let insertError = null;
      for (let i = 0; i < backupContent.length; i += 100) {
        const batch = backupContent.slice(i, i + 100);
        const { error } = await supabase.from(selectedTable).insert(batch);
        if (error) {
          insertError = error;
          break;
        }
      }
      if (insertError) throw insertError;
      toast({
        title: "Restore Complete",
        description: `Data restored to "${selectedTable}".`,
      });
    } catch (e: any) {
      toast({
        title: "Restore Failed",
        description: e.message || "Could not restore data.",
        variant: "destructive",
      });
    }
  };

  // UI
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="mb-8 flex items-center gap-3">
        <TableIcon className="h-7 w-7 text-primary" />
        <h1 className="text-3xl font-bold">Backup Management</h1>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-8 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-60">
              <label className="text-sm font-medium mb-2 block">Select Table</label>
              <select
                className={cn("rounded-md border px-3 py-2 w-full text-base")}
                value={selectedTable}
                onChange={e => setSelectedTable(e.target.value)}
              >
                {TABLES.map((tbl) => (
                  <option key={tbl.key} value={tbl.key}>{tbl.label}</option>
                ))}
              </select>
            </div>
            <Button size="sm" variant="outline" onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Download Current Data (.json)
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            Export the current data of the selected table for backup purposes.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-8 flex flex-col gap-6">
          <h2 className="text-lg font-semibold flex gap-2 items-center mb-2">
            <Upload className="h-5 w-5" /> Upload Backup File
          </h2>
          <BackupFileUpload
            onFileParsed={(data, file, type) => {
              setBackupContent(data);
              setBackupFile(file);
              setBackupType(type);
            }}
          />

          {backupContent && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Preview ({backupContent.length} rows)</h3>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setBackupContent(null);
                      setBackupFile(null);
                      setBackupType(null);
                    }}
                  >
                    <Trash className="h-4 w-4" /> Clear Preview
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleRestore}
                    disabled={!backupContent.length}
                  >
                    Restore Backup
                  </Button>
                </div>
              </div>
              <BackupPreviewTable
                data={backupContent}
                rowsPerPage={10}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
