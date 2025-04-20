import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Database } from "lucide-react";

type TableInfo = {
  name: string;
  schema: string;
  columns: {
    name: string;
    data_type: string;
    is_nullable: boolean;
    is_primary: boolean;
    default_value: string | null;
  }[];
  foreign_keys: {
    column_name: string;
    foreign_table_schema: string;
    foreign_table_name: string;
    foreign_column_name: string;
  }[];
};

export function SchemaVisualizer() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSchema, setActiveSchema] = useState("public");

  useEffect(() => {
    async function fetchSchema() {
      try {
        setIsLoading(true);
        const { data: tablesData, error: tablesError } = await supabase.rpc('get_all_tables');
        
        if (tablesError) throw tablesError;
        
        // Get columns for each table
        const tablesWithDetails = await Promise.all(
          tablesData.map(async (table: any) => {
            const { data: columnsData, error: columnsError } = await supabase.rpc(
              'get_table_columns', 
              { table_name: table.table_name, schema_name: table.table_schema }
            );
            
            if (columnsError) throw columnsError;
            
            const { data: foreignKeysData, error: foreignKeysError } = await supabase.rpc(
              'get_foreign_keys',
              { table_name: table.table_name, schema_name: table.table_schema }
            );
            
            if (foreignKeysError) throw foreignKeysError;
            
            return {
              name: table.table_name,
              schema: table.table_schema,
              columns: columnsData || [],
              foreign_keys: foreignKeysData || []
            };
          })
        );
        
        setTables(tablesWithDetails);
      } catch (error) {
        console.error("Error fetching schema:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSchema();
  }, []);

  const schemas = [...new Set(tables.map(table => table.schema))];
  const filteredTables = tables.filter(table => table.schema === activeSchema);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Database Schema</h2>
      </div>
      
      {schemas.length > 0 && (
        <Tabs defaultValue={activeSchema} onValueChange={setActiveSchema} className="w-full">
          <TabsList className="mb-4">
            {schemas.map(schema => (
              <TabsTrigger key={schema} value={schema}>
                {schema}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {schemas.map(schema => (
            <TabsContent key={schema} value={schema} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTables.length > 0 ? (
                  filteredTables.map(table => (
                    <Card key={`${table.schema}.${table.name}`} className="overflow-hidden">
                      <CardHeader className="bg-muted/50">
                        <CardTitle className="text-sm font-mono flex items-center gap-2">
                          <span className="text-muted-foreground">{table.schema}.</span>
                          {table.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="border-t">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b bg-muted/30">
                                <th className="px-4 py-2 text-left">Column</th>
                                <th className="px-4 py-2 text-left">Type</th>
                                <th className="px-4 py-2 text-center">Nullable</th>
                              </tr>
                            </thead>
                            <tbody>
                              {table.columns.map(column => (
                                <tr key={column.name} className="border-b">
                                  <td className="px-4 py-2 font-mono">
                                    {column.is_primary && (
                                      <span className="inline-flex items-center justify-center w-4 h-4 bg-amber-500 text-white rounded-full text-xs mr-1.5">
                                        P
                                      </span>
                                    )}
                                    {column.name}
                                  </td>
                                  <td className="px-4 py-2 text-xs text-muted-foreground">
                                    {column.data_type}
                                  </td>
                                  <td className="px-4 py-2 text-center">
                                    {column.is_nullable ? "✓" : "-"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          
                          {table.foreign_keys.length > 0 && (
                            <div className="px-4 py-2 border-t bg-muted/20">
                              <h4 className="text-xs font-semibold mb-1">Foreign Keys:</h4>
                              <ul className="space-y-1">
                                {table.foreign_keys.map((fk, idx) => (
                                  <li key={idx} className="text-xs">
                                    <span className="font-mono">{fk.column_name}</span> →{" "}
                                    <span className="text-muted-foreground font-mono">
                                      {fk.foreign_table_schema}.{fk.foreign_table_name}.{fk.foreign_column_name}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-muted-foreground">
                    No tables found in the {schema} schema
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
