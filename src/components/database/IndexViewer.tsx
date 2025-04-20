import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Columns4, Settings2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type IndexInfo = {
  name: string;
  table_name: string;
  index_type: string;
  is_unique: boolean;
  is_primary: boolean;
  columns: string[];
};

export function IndexViewer() {
  const [indexes, setIndexes] = useState<IndexInfo[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchTables() {
      try {
        const { data, error } = await supabase.rpc("get_public_tables");
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setTables(data.map((t: any) => t.table_name));
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    }

    fetchTables();
  }, []);

  useEffect(() => {
    async function fetchIndexes() {
      try {
        setIsLoading(true);

        const { data, error } = await supabase.rpc("get_table_indexes", { 
          table_name: selectedTable || null
        });
        
        if (error) throw error;
        
        setIndexes(data || []);
      } catch (error) {
        console.error("Error fetching indexes:", error);
        toast({
          title: "Error fetching indexes",
          description: "Could not load database indexes. Please try again.",
          variant: "destructive",
        });
        setIndexes([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchIndexes();
  }, [selectedTable, toast]);

  const getIndexTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'btree':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hash':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'gin':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'gist':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'brin':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading && indexes.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Columns4 className="h-5 w-5" />
            <CardTitle>Database Indexes</CardTitle>
          </div>
          
          {tables.length > 0 && (
            <Select
              value={selectedTable || ""}
              onValueChange={(value) => setSelectedTable(value || null)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All tables" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All tables</SelectItem>
                {tables.map(table => (
                  <SelectItem key={table} value={table}>{table}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto">
          {indexes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table</TableHead>
                  <TableHead>Index Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Columns</TableHead>
                  <TableHead>Properties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {indexes.map((index) => (
                  <TableRow key={`${index.table_name}-${index.name}`}>
                    <TableCell className="font-medium">{index.table_name}</TableCell>
                    <TableCell className="font-mono text-sm">{index.name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getIndexTypeColor(index.index_type)}`}
                      >
                        {index.index_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {index.columns.map((column, idx) => (
                          <Badge key={idx} variant="secondary">
                            {column}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {index.is_primary && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                            Primary Key
                          </Badge>
                        )}
                        {index.is_unique && (
                          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                            Unique
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              {selectedTable 
                ? `No indexes found for table "${selectedTable}"`
                : "No indexes found in the database"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
