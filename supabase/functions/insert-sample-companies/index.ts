
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Define CORS headers for browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // This endpoint only accepts POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: `Method ${req.method} not allowed` }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get auth token from request headers
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: { Authorization: authHeader },
      },
    });
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ error: 'You must be logged in to add sample companies' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const userId = user.id;
    const currentDate = new Date().toISOString();
    
    // Sample Egyptian company data with realistic information
    const egyptianCompanies = [
      {
        company_name: 'NileWare Technologies',
        address: '15 Tahrir Square, Cairo',
        register_number: 'EG-REG-1001',
        tax_card_number: 'EG-TAX-5823',
        company_number: 'EG-EGY-7124',
        created_at: currentDate,
        updated_at: currentDate,
        user_id: userId,
        is_dummy: false,
        is_archived: false
      },
      {
        company_name: 'CairoByte Software',
        address: '27 El-Giza Street, Giza',
        register_number: 'EG-REG-1002',
        tax_card_number: 'EG-TAX-6134',
        company_number: 'EG-EGY-8235',
        created_at: currentDate,
        updated_at: currentDate,
        user_id: userId,
        is_dummy: false,
        is_archived: false
      },
      {
        company_name: 'Luxor Innovations',
        address: '8 Valley of Kings Road, Luxor',
        register_number: 'EG-REG-1003',
        tax_card_number: 'EG-TAX-9472',
        company_number: 'EG-EGY-3469',
        created_at: currentDate,
        updated_at: currentDate,
        user_id: userId,
        is_dummy: false,
        is_archived: false
      },
      {
        company_name: 'DeltaCorp Solutions',
        address: '41 Corniche Road, Alexandria',
        register_number: 'EG-REG-1004',
        tax_card_number: 'EG-TAX-2857',
        company_number: 'EG-EGY-5762',
        created_at: currentDate,
        updated_at: currentDate,
        user_id: userId,
        is_dummy: false,
        is_archived: false
      },
      {
        company_name: 'Pharos Solutions',
        address: '12 El-Nasr Street, Aswan',
        register_number: 'EG-REG-1005',
        tax_card_number: 'EG-TAX-1498',
        company_number: 'EG-EGY-9213',
        created_at: currentDate,
        updated_at: currentDate,
        user_id: userId,
        is_dummy: false,
        is_archived: false
      }
    ];

    // Insert the companies into the database
    let successCount = 0;
    let duplicateCount = 0;
    const errors = [];

    for (const company of egyptianCompanies) {
      // Check if company already exists to avoid unique constraint violations
      const { data: existingCompany, error: checkError } = await supabase
        .from('companies')
        .select('id')
        .or(`register_number.eq.${company.register_number},company_number.eq.${company.company_number}`)
        .single();

      if (checkError && !checkError.message.includes('No rows found')) {
        console.error(`Error checking for company ${company.company_name}:`, checkError);
        errors.push(`Error checking for company ${company.company_name}: ${checkError.message}`);
        continue;
      }

      if (existingCompany) {
        console.log(`Company with register/company number already exists: ${company.company_name}`);
        duplicateCount++;
        continue;
      }

      // Insert company
      const { error: insertError } = await supabase
        .from('companies')
        .insert(company);

      if (insertError) {
        console.error(`Error inserting company ${company.company_name}:`, insertError);
        errors.push(`Error inserting company ${company.company_name}: ${insertError.message}`);
      } else {
        successCount++;
        console.log(`Successfully added company: ${company.company_name}`);
      }
    }

    // Create response message
    let message = '';
    if (successCount > 0) {
      message = `Successfully added ${successCount} sample ${successCount === 1 ? 'company' : 'companies'}.`;
    } else if (duplicateCount === egyptianCompanies.length) {
      message = 'All companies already exist in the database.';
    } else {
      message = 'No companies were added.';
    }

    // Add error information if any
    if (errors.length > 0) {
      console.error("Errors during company insertion:", errors);
      message += ` Encountered ${errors.length} errors.`;
    }

    return new Response(
      JSON.stringify({ 
        success: successCount > 0, 
        message, 
        data: { successCount, duplicateCount, errors } 
      }),
      { 
        status: successCount > 0 ? 200 : (errors.length > 0 ? 500 : 400), 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Error seeding sample companies:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: `Error inserting companies: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
