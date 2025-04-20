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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table as TableIcon, Search } from "lucide-react";

type TableData = {
  [key: string]: any;
};

type ColumnInfo = {
  name: string;
  data_type: string;
  is_primary: boolean;
};

export function TableViewer() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableCount, setTableCount] = useState(0);

  useEffect(() => {
    async function fetchTables() {
      try {
        const { data, error } = await supabase.rpc("get_public_tables");
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setTables(data.map((t: any) => t.table_name));
          setSelectedTable(data[0].table_name);
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTables();
  }, []);

  useEffect(() => {
    if (!selectedTable) return;

    async function fetchTableData() {
      try {
        setIsLoading(true);
        
        const { data: columnsData, error: columnsError } = await supabase.rpc(
          "get_table_columns", 
          { table_name: selectedTable, schema_name: "public" }
        );
        
        if (columnsError) throw columnsError;
        setColumns(columnsData || []);
        
        const { count, error: countError } = await supabase
          .from(selectedTable)
          .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;
        setTableCount(count || 0);
        
        let query = supabase
          .from(selectedTable)
          .select("*")
          .limit(100);
        
        const { data, error } = await query;
        
        if (error) throw error;
        setTableData(data || []);
      } catch (error) {
        console.error(`Error fetching data for ${selectedTable}:`, error);
        setTableData([]);
        setColumns([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTableData();
  }, [selectedTable]);

  const filteredData = tableData.filter(row => {
    if (!searchTerm) return true;
    
    return Object.values(row).some(value => 
      value !== null && 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading && tables.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TableIcon className="h-5 w-5" />
            <CardTitle>Table Explorer</CardTitle>
          </div>
          {tableCount > 0 && (
            <Badge variant="secondary">{tableCount.toLocaleString()} rows</Badge>
          )}
        </div>
        <CardDescription>
          View and search data from your Supabase tables
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row gap-4">
          <Select
            value={selectedTable}
            onValueChange={setSelectedTable}
            disabled={isLoading || tables.length === 0}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select a table" />
            </SelectTrigger>
            <SelectContent>
              {tables.map(table => (
                <SelectItem key={table} value={table}>
                  {table}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search table data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading || tableData.length === 0}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-4">
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : (
          <div className="overflow-auto">
            {columns.length > 0 && filteredData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead key={column.name} className="whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {column.is_primary && (
                            <span className="inline-flex items-center justify-center w-4 h-4 bg-amber-500 text-white rounded-full text-xs">
                              P
                            </span>
                          )}
                          <span>{column.name}</span>
                        </div>
                        <div className="text-xs text-muted-foreground font-normal">
                          {column.data_type}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {columns.map((column) => (
                        <TableCell key={column.name} className="align-top">
                          {formatCellValue(row[column.name], column.data_type)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                {tables.length === 0
                  ? "No tables available in the database"
                  : columns.length === 0
                  ? `No columns found in table "${selectedTable}"`
                  : `No data found in table "${selectedTable}"`}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatCellValue(value: any, dataType: string): React.ReactNode {
  if (value === null) {
    return <span className="text-muted-foreground italic">null</span>;
  }

  if (typeof value === 'object') {
    try {
      return (
        <div className="max-w-[300px] overflow-x-auto">
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      );
    } catch {
      return String(value);
    }
  }

  if (dataType.includes('timestamp') || dataType.includes('date')) {
    try {
      return new Date(value).toLocaleString();
    } catch {
      return String(value);
    }
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  return String(value);
}
