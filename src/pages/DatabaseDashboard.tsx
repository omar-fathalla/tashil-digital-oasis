
import { Columns4, Database, Table } from "lucide-react";
import { SchemaVisualizer } from "@/components/database/SchemaVisualizer";
import { TableViewer } from "@/components/database/TableViewer";
import { IndexViewer } from "@/components/database/IndexViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DatabaseDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Database Dashboard</h1>
      
      <Tabs defaultValue="tables" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="tables" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            <span>Tables</span>
          </TabsTrigger>
          <TabsTrigger value="schema" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Schema</span>
          </TabsTrigger>
          <TabsTrigger value="indexes" className="flex items-center gap-2">
            <Columns4 className="h-4 w-4" />
            <span>Indexes</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tables" className="mt-0">
          <TableViewer />
        </TabsContent>
        
        <TabsContent value="schema" className="mt-0">
          <SchemaVisualizer />
        </TabsContent>
        
        <TabsContent value="indexes" className="mt-0">
          <IndexViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DatabaseDashboard;
