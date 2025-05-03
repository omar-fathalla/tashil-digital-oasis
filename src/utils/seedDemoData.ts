
import { supabase } from "@/integrations/supabase/client";

// This function checks if we need to seed demo data and does so if needed
export const ensureDemoData = async () => {
  try {
    // Check if we already have companies and employees
    const { count: companyCount, error: companyError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });
    
    if (companyError) {
      console.error("Error checking companies:", companyError);
      return;
    }
    
    const { count: employeeCount, error: employeeError } = await supabase
      .from('employee_registrations')
      .select('*', { count: 'exact', head: true });
      
    if (employeeError) {
      console.error("Error checking employees:", employeeError);
      return;
    }
    
    // If we already have data, don't seed
    if (companyCount && companyCount > 0 && employeeCount && employeeCount > 0) {
      console.log("Demo data already exists, skipping seeding");
      return;
    }
    
    console.log("No demo data found, seeding data...");
    
    // Generate some demo data using the API instead of direct SQL
    // Add employees if needed
    if (!employeeCount || employeeCount === 0) {
      const employees = [
        {
          full_name: 'John Smith',
          first_name: 'John',
          last_name: 'Smith',
          employee_id: 'EMP001',
          position: 'Software Engineer',
          sex: 'male',
          status: 'approved',
          area: 'Technology'
        },
        {
          full_name: 'Sarah Johnson',
          first_name: 'Sarah',
          last_name: 'Johnson',
          employee_id: 'EMP002',
          position: 'Product Manager',
          sex: 'female',
          status: 'approved',
          area: 'Product'
        },
        {
          full_name: 'Michael Brown',
          first_name: 'Michael',
          last_name: 'Brown',
          employee_id: 'EMP003',
          position: 'UX Designer',
          sex: 'male',
          status: 'under-review',
          area: 'Design'
        }
      ];
      
      for (const employee of employees) {
        const { error } = await supabase.from('employee_registrations').insert(employee);
        if (error) console.error("Error inserting employee:", error);
      }
    }
    
    // For the requests table that doesn't have a user_id foreign key constraint
    const { count: requestCount, error: requestError } = await supabase
      .from('registration_requests')
      .select('*', { count: 'exact', head: true });
      
    if (requestError) {
      console.error("Error checking requests:", requestError);
    } else if (!requestCount || requestCount === 0) {
      const requests = [
        {
          id: crypto.randomUUID(),
          full_name: 'Alexander Green',
          national_id: '123456789',
          status: 'approved'
        },
        {
          id: crypto.randomUUID(),
          full_name: 'Olivia Miller',
          national_id: '234567890',
          status: 'pending'
        }
      ];
      
      for (const request of requests) {
        const { error } = await supabase.from('registration_requests').insert(request);
        if (error) console.error("Error inserting request:", error);
      }
    }
    
    // Add notifications
    const { count: notificationCount, error: notificationError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true });
      
    if (notificationError) {
      console.error("Error checking notifications:", notificationError);
    } else if (!notificationCount || notificationCount === 0) {
      const notifications = [
        {
          title: 'New Employee Registration',
          message: 'A new employee has been registered in the system.',
          read: false
        },
        {
          title: 'Request Approved',
          message: 'Your registration request has been approved.',
          read: false
        },
        {
          title: 'System Maintenance',
          message: 'System will undergo maintenance this weekend.',
          read: false
        }
      ];
      
      for (const notification of notifications) {
        const { error } = await supabase.from('notifications').insert(notification);
        if (error) console.error("Error inserting notification:", error);
      }
    }

    console.log("Demo data seeded successfully");
    
  } catch (error) {
    console.error("Error seeding demo data:", error);
  }
};
