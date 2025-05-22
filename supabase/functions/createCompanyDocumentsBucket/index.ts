
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });

    // Check if bucket already exists
    const { data: existingBuckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      throw new Error(`Failed to list buckets: ${bucketsError.message}`);
    }
    
    const bucketExists = existingBuckets.some(bucket => bucket.name === 'company-documents');
    
    if (!bucketExists) {
      // Create the company-documents bucket
      const { error: createError } = await supabase
        .storage
        .createBucket('company-documents', { 
          public: true,
          fileSizeLimit: 5242880 // 5MB in bytes
        });
      
      if (createError) {
        throw new Error(`Failed to create bucket: ${createError.message}`);
      }
      
      // Configure CORS for the bucket
      const { error: corsError } = await supabase
        .storage
        .from('company-documents')
        .updateBucketCors([{
          allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          maxAgeSeconds: 3600
        }]);
      
      if (corsError) {
        throw new Error(`Failed to configure CORS: ${corsError.message}`);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Successfully created company-documents bucket'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'company-documents bucket already exists'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
