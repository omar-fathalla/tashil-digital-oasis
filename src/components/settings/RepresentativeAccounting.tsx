
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
  type: 'promo' | 'company';
  company_name: string;
  value: number;
  created_at: string;
};

type Company = {
  id: string;
  name: string;
  type: 'advertising' | 'product';
};

export const RepresentativeAccounting = () => {
  const [representatives, setRepresentatives] = useState<Representative[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newRep, setNewRep] = useState({ full_name: '', type: '', company_id: '' });
  const [filter, setFilter] = useState({ type: 'all', company_type: 'all' });
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
    fetchRepresentatives();
  }, []);

  const fetchCompanies = async () => {
    const { data, error } = await supabase.from('companies').select('*');
    if (data) setCompanies(data);
    if (error) console.error(error);
  };

  const fetchRepresentatives = async () => {
    const { data, error } = await supabase
      .from('representatives')
      .select('representatives.*, companies.name as company_name')
      .join('companies', 'representatives.company_id = companies.id');
    
    if (data) setRepresentatives(data);
    if (error) console.error(error);
  };

  const addRepresentative = async () => {
    const { data, error } = await supabase.from('representatives').insert({
      full_name: newRep.full_name,
      type: newRep.type,
      company_id: newRep.company_id
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Representative added' });
      fetchRepresentatives();
      setNewRep({ full_name: '', type: '', company_id: '' });
    }
  };

  const filteredRepresentatives = representatives.filter(rep => 
    (filter.type === 'all' || rep.type === filter.type) &&
    (filter.company_type === 'all')
  );

  const calculateTotals = () => {
    const promoReps = filteredRepresentatives.filter(r => r.type === 'promo');
    const companyReps = filteredRepresentatives.filter(r => r.type === 'company');

    return {
      promoTotal: promoReps.length,
      promoValue: promoReps.reduce((sum, rep) => sum + rep.value, 0),
      companyTotal: companyReps.length,
      companyValue: companyReps.reduce((sum, rep) => sum + rep.value, 0)
    };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Add Representative</h2>
          <div className="space-y-2">
            <Input 
              placeholder="Full Name" 
              value={newRep.full_name}
              onChange={(e) => setNewRep(prev => ({ ...prev, full_name: e.target.value }))}
            />
            <Select 
              value={newRep.type} 
              onValueChange={(value) => setNewRep(prev => ({ ...prev, type: value }))}
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
              onValueChange={(value) => setNewRep(prev => ({ ...prev, company_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map(company => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
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
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Representatives Table</h2>
        <div className="flex space-x-2 mb-4">
          <Select 
            value={filter.type} 
            onValueChange={(value) => setFilter(prev => ({ ...prev, type: value }))}
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
            {filteredRepresentatives.map(rep => (
              <TableRow key={rep.id}>
                <TableCell>{rep.full_name}</TableCell>
                <TableCell>{rep.type}</TableCell>
                <TableCell>{rep.company_name}</TableCell>
                <TableCell>{rep.value}</TableCell>
                <TableCell>{new Date(rep.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="icon">
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
