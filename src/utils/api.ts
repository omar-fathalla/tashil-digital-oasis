
import { supabase } from "@/integrations/supabase/client";

export type ApiResponse<T = any> = {
  success: boolean;
  data: T | null;
  message: string;
};

/**
 * Invoke a Supabase Edge Function with authentication
 */
export async function callApi<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, any>
): Promise<ApiResponse<T>> {
  try {
    const session = await supabase.auth.getSession();
    
    if (!session.data.session) {
      return {
        success: false,
        data: null,
        message: 'Authentication required'
      };
    }
    
    const { data, error } = await supabase.functions.invoke(`api-${endpoint}`, {
      method,
      body,
      headers: {
        Authorization: `Bearer ${session.data.session.access_token}`,
      },
    });
    
    if (error) {
      console.error('API error:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'An error occurred'
      };
    }
    
    return data as ApiResponse<T>;
    
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Helper functions for common API operations
 */
export const api = {
  // Employees API
  employees: {
    getAll: () => callApi<any[]>('employees'),
    getById: (id: string) => callApi<any>(`employees/${id}`),
    create: (data: any) => callApi<any>('employees', 'POST', data),
    update: (id: string, data: any) => callApi<any>(`employees/${id}`, 'PUT', data),
    delete: (id: string) => callApi<void>(`employees/${id}`, 'DELETE')
  },
  
  // Companies API
  companies: {
    getAll: () => callApi<any[]>('companies'),
    getById: (id: string) => callApi<any>(`companies/${id}`),
    create: (data: any) => callApi<any>('companies', 'POST', data),
    update: (id: string, data: any) => callApi<any>(`companies/${id}`, 'PUT', data),
    delete: (id: string) => callApi<void>(`companies/${id}`, 'DELETE')
  },
  
  // Notifications API
  notifications: {
    getAll: () => callApi<any[]>('notifications'),
    getById: (id: string) => callApi<any>(`notifications/${id}`),
    create: (data: any) => callApi<any>('notifications', 'POST', data),
    update: (id: string, data: any) => callApi<any>(`notifications/${id}`, 'PUT', data),
    delete: (id: string) => callApi<void>(`notifications/${id}`, 'DELETE'),
    markAsRead: (id: string) => callApi<any>(`notifications/${id}`, 'PUT', { read: true })
  }
};
