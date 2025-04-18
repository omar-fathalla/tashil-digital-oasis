
// Mock Supabase client that doesn't actually connect to Supabase
// This file replaces the real Supabase client with a mock version

class MockSupabaseClient {
  from() {
    return {
      select: () => ({
        eq: () => ({
          order: () => ({
            then: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
        order: () => ({
          then: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    };
  }

  auth = {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  };

  storage = {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  };
}

export const supabase = new MockSupabaseClient();
