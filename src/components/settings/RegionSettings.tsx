
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Region {
  id: string;
  name: string;
  visibleTo: "all" | "specificCompany";
  companyId?: string;
}

interface Company {
  id: string;
  name: string;
}

export const RegionSettings = () => {
  const { toast } = useToast();
  const [regions, setRegions] = useState<Region[]>([
    { id: "1", name: "Cairo", visibleTo: "all" },
    { id: "2", name: "Alexandria", visibleTo: "all" },
    { id: "3", name: "Giza", visibleTo: "all" },
    { id: "4", name: "Luxor", visibleTo: "specificCompany", companyId: "1" },
    { id: "5", name: "Aswan", visibleTo: "specificCompany", companyId: "2" },
  ]);

  const [companies] = useState<Company[]>([
    { id: "1", name: "Company A" },
    { id: "2", name: "Company B" },
    { id: "3", name: "Company C" },
  ]);

  const [newRegion, setNewRegion] = useState<Omit<Region, "id">>({
    name: "",
    visibleTo: "all",
  });

  const handleAddRegion = () => {
    if (!newRegion.name.trim()) {
      toast({
        title: "Error",
        description: "Region name is required",
        variant: "destructive",
      });
      return;
    }

    setRegions([
      ...regions,
      {
        id: Date.now().toString(),
        ...newRegion,
      },
    ]);

    setNewRegion({
      name: "",
      visibleTo: "all",
    });

    toast({
      title: "Success",
      description: "Region added successfully",
    });
  };

  const handleRemoveRegion = (id: string) => {
    setRegions(regions.filter((region) => region.id !== id));
    toast({
      title: "Success",
      description: "Region removed successfully",
    });
  };

  const handleUpdateRegion = (id: string, field: keyof Region, value: string) => {
    setRegions(
      regions.map((region) => {
        if (region.id === id) {
          if (field === "visibleTo" && value === "all") {
            const { companyId, ...rest } = region;
            return { ...rest, visibleTo: value as "all" | "specificCompany" };
          }
          return { ...region, [field]: value };
        }
        return region;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Configure Allowed Regions</h2>
        <p className="text-muted-foreground">
          Add or remove regions and control which companies can see them.
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region Name</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regions.map((region) => (
                <TableRow key={region.id}>
                  <TableCell className="font-medium">{region.name}</TableCell>
                  <TableCell>
                    <Select
                      value={region.visibleTo}
                      onValueChange={(value) => handleUpdateRegion(region.id, "visibleTo", value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Companies</SelectItem>
                        <SelectItem value="specificCompany">Specific Company</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {region.visibleTo === "specificCompany" && (
                      <Select
                        value={region.companyId || ""}
                        onValueChange={(value) => handleUpdateRegion(region.id, "companyId", value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRegion(region.id)}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Region Name</label>
              <Input
                value={newRegion.name}
                onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                placeholder="e.g., Sharm El-Sheikh"
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Visibility</label>
              <Select
                value={newRegion.visibleTo}
                onValueChange={(value) => 
                  setNewRegion({ 
                    ...newRegion, 
                    visibleTo: value as "all" | "specificCompany",
                    ...(value === "all" ? { companyId: undefined } : {})
                  })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  <SelectItem value="specificCompany">Specific Company</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newRegion.visibleTo === "specificCompany" && (
              <div>
                <label className="text-sm font-medium">Company</label>
                <Select
                  value={newRegion.companyId || ""}
                  onValueChange={(value) => setNewRegion({ ...newRegion, companyId: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={handleAddRegion} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" /> Add Region
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
