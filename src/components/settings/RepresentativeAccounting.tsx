
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Representative = {
  id: string;
  full_name: string;
  type: "promo" | "company";
  company_id: string | null;
  value: number;
  created_at: string;
};

type Company = {
  id: string;
  name: string;
  type: "advertising" | "product";
};

type RepWithCompany = Representative & { company_name: string; company_type: string };

export const RepresentativeAccounting = () => {
  const [representatives, setRepresentatives] = useState<RepWithCompany[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newRep, setNewRep] = useState({ full_name: "", type: "" as "promo" | "company" | "", company_id: "" });
  const [filter, setFilter] = useState({ type: "all", company_type: "all" });
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
    return typeOk && companyTypeOk;
  });

  const calculateTotals = () => {
    const promoReps = filteredRepresentatives.filter((r) => r.type === "promo");
    const companyReps = filteredRepresentatives.filter((r) => r.type === "company");

    return {
      promoTotal: promoReps.length,
      promoValue: promoReps.reduce((sum, rep) => sum + (rep.value || 0), 0),
      companyTotal: companyReps.length,
      companyValue: companyReps.reduce((sum, rep) => sum + (rep.value || 0), 0),
      byCompany: companies.map((company) => {
        const reps = filteredRepresentatives.filter((r) => r.company_id === company.id);
        return {
          company: company.name,
          type: company.type,
          total: reps.length,
          value: reps.reduce((sum, rep) => sum + (rep.value || 0), 0),
        };
      }),
    };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Representative Accounting</h1>
      </div>
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
        <div>
          <h2 className="text-lg font-semibold mb-2">Representative Totals</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary p-4 rounded-lg">
              <h3 className="font-medium">Promo Representatives</h3>
              <p className="text-2xl font-bold">{totals.promoTotal}</p>
              <p>Total Value: {totals.promoValue}</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <h3 className="font-medium">Company Representatives</h3>
              <p className="text-2xl font-bold">{totals.companyTotal}</p>
              <p>Total Value: {totals.companyValue}</p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">By Company</h4>
            <div className="space-y-1">
              {totals.byCompany.map((c) => (
                <div key={c.company} className="flex justify-between border-b last:border-0 pb-1 text-sm">
                  <span>
                    {c.company} <span className="text-muted-foreground">({c.type})</span>
                  </span>
                  <span>
                    {c.total} reps / Value: {c.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Representatives Table</h2>
        <div className="flex space-x-2 mb-4">
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
