
import { corsHeaders } from '../_shared/cors.ts';
import { verifyAuth } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const { isAuthorized, userId } = await verifyAuth(req);
    
    if (!isAuthorized) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Unauthorized' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 401 
        }
      );
    }

    // Parse URL and get the operation to perform
    const url = new URL(req.url);
    const operation = url.pathname.split('/').pop();

    // Handle different operations
    let result;

    switch (operation) {
      case 'tables':
        result = await handleTables();
        break;
      case 'schema':
        const tableName = url.searchParams.get('table');
        result = await handleSchema(tableName);
        break;
      case 'indexes':
        const tableFilter = url.searchParams.get('table');
        result = await handleIndexes(tableFilter);
        break;
      default:
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Unknown operation' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
            status: 400 
          }
        );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in database API:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'An error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

async function handleTables() {
  // This would normally query the database for table info
  // For now returning dummy data
  return [
    { name: 'companies', schema: 'public', rowCount: 10 },
    { name: 'employee_registrations', schema: 'public', rowCount: 25 },
    { name: 'employee_requests', schema: 'public', rowCount: 15 },
    { name: 'registration_requests', schema: 'public', rowCount: 8 },
  ];
}

async function handleSchema(tableName: string | null) {
  // This would normally query the database for schema info
  // For now returning dummy data
  const tables = {
    companies: {
      columns: [
        { name: 'id', type: 'uuid', nullable: false, isPrimary: true },
        { name: 'company_name', type: 'text', nullable: false },
        { name: 'created_at', type: 'timestamp with time zone', nullable: true },
        { name: 'updated_at', type: 'timestamp with time zone', nullable: true },
      ],
      foreignKeys: []
    },
    employee_registrations: {
      columns: [
        { name: 'id', type: 'uuid', nullable: false, isPrimary: true },
        { name: 'full_name', type: 'text', nullable: false },
        { name: 'employee_id', type: 'text', nullable: false },
        { name: 'company_id', type: 'uuid', nullable: true },
        { name: 'status', type: 'text', nullable: true },
      ],
      foreignKeys: [
        { column: 'company_id', foreignTable: 'companies', foreignColumn: 'id' }
      ]
    }
  };

  if (tableName && tables[tableName]) {
    return tables[tableName];
  }
  
  return Object.keys(tables).map(name => ({
    name,
    schema: 'public',
    ...tables[name]
  }));
}

async function handleIndexes(tableName: string | null) {
  // This would normally query the database for index info
  // For now returning dummy data
  const allIndexes = [
    {
      name: 'companies_pkey',
      table_name: 'companies',
      index_type: 'btree',
      is_unique: true,
      is_primary: true,
      columns: ['id']
    },
    {
      name: 'employee_registrations_pkey',
      table_name: 'employee_registrations',
      index_type: 'btree',
      is_unique: true,
      is_primary: true,
      columns: ['id']
    },
    {
      name: 'employee_registrations_employee_id_idx',
      table_name: 'employee_registrations',
      index_type: 'btree',
      is_unique: false,
      is_primary: false,
      columns: ['employee_id']
    }
  ];
  
  if (tableName) {
    return allIndexes.filter(idx => idx.table_name === tableName);
  }
  
  return allIndexes;
}
