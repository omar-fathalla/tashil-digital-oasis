
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDatabaseSchema = () => {
  return useQuery({
    queryKey: ["database-schema"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_all_tables");
      
      if (error) throw error;
      return data;
    }
  });
};

export const useDatabaseTable = (tableName: string) => {
  return useQuery({
    queryKey: ["database-table", tableName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .limit(100);
      
      if (error) throw error;
      return data;
    },
    enabled: !!tableName
  });
};

export const useTableColumns = (tableName: string, schemaName = "public") => {
  return useQuery({
    queryKey: ["table-columns", schemaName, tableName],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_table_columns", {
        table_name: tableName,
        schema_name: schemaName
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!tableName
  });
};

export const useTableIndexes = (tableName: string | null = null) => {
  return useQuery({
    queryKey: ["table-indexes", tableName],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_table_indexes", {
        table_name: tableName
      });
      
      if (error) throw error;
      return data;
    }
  });
};
