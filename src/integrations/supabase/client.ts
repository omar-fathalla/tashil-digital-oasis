
// Mock Supabase client that doesn't actually connect to Supabase
// This file replaces the real Supabase client with a mock version

class MockSupabaseClient {
  from(table) {
    return {
      select: () => ({
        eq: (field, value) => ({
          order: (column) => ({
            then: (callback) => Promise.resolve({ data: [], error: null }),
          }),
        }),
        order: (column) => ({
          then: (callback) => Promise.resolve({ data: [], error: null }),
        }),
      }),
      insert: (data) => Promise.resolve({ data: null, error: null }),
      update: (data) => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    };
  }

  auth = {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: (callback) => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
    signUp: (options) => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: (options) => Promise.resolve({ data: { user: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  };

  storage = {
    from: (bucket) => ({
      upload: (path, file) => Promise.resolve({ data: { path }, error: null }),
      getPublicUrl: (path) => ({ data: { publicUrl: '' } }),
    }),
  };
}

export const supabase = new MockSupabaseClient();
