
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import { useRegions } from "./hooks/useRegions";

export const RegionSettings = () => {
  const { regions, isLoading, addRegion, updateRegion, deleteRegion } = useRegions();
  const [newRegion, setNewRegion] = useState({ name: "" });

  const handleAddRegion = async () => {
    if (!newRegion.name.trim()) return;

    try {
      await addRegion(newRegion);
      setNewRegion({ name: "" });
    } catch (error) {
      console.error("Failed to add region", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Configure Regions</h2>
        <p className="text-muted-foreground">
          Add, update, or remove regions in your system.
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region Name</TableHead>
                <TableHead className="w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regions.map((region) => (
                <TableRow key={region.id}>
                  <TableCell>
                    <Input
                      value={region.name}
                      onChange={(e) => updateRegion(region.id!, 'name', e.target.value)}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRegion(region.id!)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Add New Region</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Region name"
              value={newRegion.name}
              onChange={(e) => setNewRegion({ name: e.target.value })}
              className="flex-grow"
            />
            <Button 
              onClick={handleAddRegion} 
              disabled={!newRegion.name.trim()}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Region
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
