
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ValidationSetting = {
  key: string;
  value: any; // Change type to 'any' instead of 'string | object'
  updated_at: string;
};

export const useValidationSettings = () => {
  const fetchValidationSettings = async (): Promise<ValidationSetting[]> => {
    const { data, error } = await supabase
      .from('system_settings')
      .select('key, value, updated_at')
      .eq('category', 'validation');

    if (error) {
      console.error('Error fetching validation settings:', error);
      throw error;
    }

    // Cast the data to match our expected ValidationSetting type
    return (data || []) as ValidationSetting[];
  };

  const { 
    data: validationSettings = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['validation-settings'],
    queryFn: fetchValidationSettings,
  });

  // Helper function to get a specific validation setting
  const getValidationSetting = (key: string) => {
    return validationSettings.find(setting => setting.key === key);
  };

  return {
    validationSettings,
    isLoading,
    error,
    getValidationSetting
  };
};
