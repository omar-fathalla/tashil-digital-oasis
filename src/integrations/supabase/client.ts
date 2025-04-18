
// Mock Supabase client that doesn't actually connect to Supabase
// This file replaces the real Supabase client with a mock version

class MockSupabaseClient {
  from(table: string) {
    return {
      select: () => ({
        eq: (column: string, value: any) => ({
          order: (column: string, options?: { ascending?: boolean }) => ({
            then: (callback: any) => Promise.resolve({ data: [], error: null }),
          }),
        }),
        order: (column: string, options?: { ascending?: boolean }) => ({
          then: (callback: any) => Promise.resolve({ data: [], error: null }),
        }),
      }),
      insert: (data: any) => Promise.resolve({ data: null, error: null }),
      update: (data: any) => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    };
  }

  auth = {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
    signUp: (data: any) => Promise.resolve({ data: { user: { id: "mock-user-id" } }, error: null }),
    signInWithPassword: (data: any) => Promise.resolve({ data: { user: { id: "mock-user-id" } }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  };

  storage = {
    from: (bucket: string) => ({
      upload: (path: string, file: File) => Promise.resolve({ data: { path }, error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: '' } }),
    }),
  };
}

export const supabase = new MockSupabaseClient();
