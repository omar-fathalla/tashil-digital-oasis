
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export type Permission = {
  permission_key: string;
  permission_name: string;
};

export function usePermissions() {
  const { user } = useAuth();

  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ['user-permissions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .rpc('get_user_permissions', { user_id: user.id });
      
      if (error) throw error;
      return data as Permission[];
    },
    enabled: !!user,
  });

  const hasPermission = (key: string) => {
    return permissions.some(p => p.permission_key === key);
  };

  return {
    permissions,
    isLoading,
    hasPermission
  };
}
