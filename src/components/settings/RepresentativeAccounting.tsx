
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RepSummaryCards } from "./representative-accounting/RepSummaryCards";
import { RepSearchAndExport } from "./representative-accounting/RepSearchAndExport";
// Import types from the types file instead of redeclaring
import { RepWithCompany, Company, Representative } from "./representative-accounting/types";

export const RepresentativeAccounting = () => {
  const [representatives, setRepresentatives] = useState<RepWithCompany[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newRep, setNewRep] = useState({ full_name: "", type: "" as "promo" | "company" | "", company_id: "" });
  const [filter, setFilter] = useState({ type: "all", company_type: "all" });
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (companies.length > 0) {
      fetchRepresentatives();
    }
  }, [companies]);

  const fetchCompanies = async () => {
    const { data, error } = await supabase.from("companies").select("*");
    if (data) setCompanies(data as Company[]);
    if (error) console.error(error);
  };

  const fetchRepresentatives = async () => {
    const { data, error } = await supabase.from("representatives").select("*");
    if (data && Array.isArray(data)) {
      const result: RepWithCompany[] = data.map((rep: Representative) => {
        const company = companies.find((c) => c.id === rep.company_id);
        return {
          ...rep,
          company_name: company?.name || "",
          company_type: company?.type || "",
        };
      });
      setRepresentatives(result);
    }
    if (error) console.error(error);
  };

  const addRepresentative = async () => {
    if (!newRep.full_name || !newRep.type || !newRep.company_id) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("representatives").insert({
      full_name: newRep.full_name,
      type: newRep.type,
      company_id: newRep.company_id,
      // value is auto-set by trigger
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Representative added" });
      fetchRepresentatives();
      setNewRep({ full_name: "", type: "", company_id: "" });
    }
  };

  const filteredRepresentatives = representatives.filter((rep) => {
    const typeOk = filter.type === "all" || rep.type === filter.type;
    const companyTypeOk = filter.company_type === "all" || rep.company_type === filter.company_type;
    const searchOk = searchQuery
      ? rep.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rep.company_name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return typeOk && companyTypeOk && searchOk;
  });

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Representative Accounting</h1>
      </div>

      <RepSummaryCards representatives={filteredRepresentatives} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Add Representative</h2>
          <div className="space-y-2">
            <Input
              placeholder="Full Name"
              value={newRep.full_name}
              onChange={(e) => setNewRep((prev) => ({ ...prev, full_name: e.target.value }))}
            />
            <Select
              value={newRep.type}
              onValueChange={(value) => setNewRep((prev) => ({ ...prev, type: value as "promo" | "company" }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Representative Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promo">Promo</SelectItem>
                <SelectItem value="company">Company</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={newRep.company_id}
              onValueChange={(value) => setNewRep((prev) => ({ ...prev, company_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}{" "}
                    <span className="text-xs text-muted-foreground ml-1">({company.type})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addRepresentative} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Representative
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Representatives Table</h2>
        <RepSearchAndExport onSearch={setSearchQuery} data={filteredRepresentatives} />
        
        <div className="flex space-x-2 mb-4 mt-4">
          <Select
            value={filter.type}
            onValueChange={(value) => setFilter((prev) => ({ ...prev, type: value }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Representative Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="promo">Promo</SelectItem>
              <SelectItem value="company">Company</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filter.company_type}
            onValueChange={(value) => setFilter((prev) => ({ ...prev, company_type: value }))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Company Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Company Types</SelectItem>
              <SelectItem value="advertising">Advertising</SelectItem>
              <SelectItem value="product">Product</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRepresentatives.map((rep) => (
              <TableRow key={rep.id}>
                <TableCell>{rep.full_name}</TableCell>
                <TableCell>{rep.type}</TableCell>
                <TableCell>
                  {rep.company_name}{" "}
                  <span className="text-xs text-muted-foreground">({rep.company_type})</span>
                </TableCell>
                <TableCell>{rep.value}</TableCell>
                <TableCell>{rep.created_at ? new Date(rep.created_at).toLocaleDateString() : ""}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="icon" disabled>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
