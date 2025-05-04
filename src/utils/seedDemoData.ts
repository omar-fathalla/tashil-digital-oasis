import { supabase } from "@/integrations/supabase/client";
import { faker } from '@faker-js/faker';

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
    
    // If we already have data, don't seed companies but check if we need digital ID employees
    if (companyCount && companyCount > 0 && employeeCount && employeeCount > 0) {
      console.log("Demo data already exists, checking for digital ID data");
      
      // Check for approved employees (which are candidates for digital IDs)
      const { count: approvedCount, error: approvedError } = await supabase
        .from('employee_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');
        
      if (approvedError) {
        console.error("Error checking approved employees:", approvedError);
      } else if (!approvedCount || approvedCount < 15) {
        console.log("Seeding digital ID employee data");
        await seedDigitalIDData();
      }
      
      // Check notifications and seed more if needed
      const { count: notificationCount, error: notificationError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true });
        
      if (notificationError) {
        console.error("Error checking notifications:", notificationError);
      } else if (!notificationCount || notificationCount < 5) {
        await seedApplicationStatusData();
      }
      
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
    
    // Add notifications and application status data
    await seedApplicationStatusData();
    
    // Add digital ID data
    await seedDigitalIDData();
    
    console.log("Demo data seeded successfully");
    
  } catch (error) {
    console.error("Error seeding demo data:", error);
  }
};

// Function to seed data specifically for application status page
const seedApplicationStatusData = async () => {
  try {
    // Check existing notifications count
    const { count: notificationCount, error: notificationError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true });
      
    if (notificationError) {
      console.error("Error checking notifications:", notificationError);
      return;
    }
    
    // If we have fewer than 5 notifications, add more
    if (!notificationCount || notificationCount < 5) {
      console.log("Seeding notification data for application status...");
      
      const notificationTypes = [
        'request_approved',
        'request_rejected',
        'missing_documents',
        'document_rejected',
        'id_generated'
      ];
      
      const notifications = [];
      
      for (let i = 0; i < 5; i++) {
        const type = notificationTypes[i % notificationTypes.length];
        let title, message;
        
        switch (type) {
          case 'request_approved':
            title = 'Request Approved';
            message = `Registration request for ${faker.person.fullName()} has been approved`;
            break;
          case 'request_rejected':
            title = 'Request Rejected';
            message = `Registration request for ${faker.person.fullName()} was rejected due to incomplete documentation`;
            break;
          case 'missing_documents':
            title = 'Missing Documents';
            message = `Please upload required identification documents for ${faker.person.fullName()}`;
            break;
          case 'document_rejected':
            title = 'Document Rejected';
            message = `The submitted photo ID for ${faker.person.fullName()} needs to be updated`;
            break;
          case 'id_generated':
            title = 'ID Card Generated';
            message = `Employee ID card for ${faker.person.fullName()} is ready for printing`;
            break;
          default:
            title = 'System Notification';
            message = 'Important system update information';
        }
        
        notifications.push({
          title,
          message,
          read: Math.random() > 0.7, // 30% chance of being read
          type,
          created_at: faker.date.recent({ days: 10 }).toISOString()
        });
      }
      
      // Insert the notifications
      for (const notification of notifications) {
        const { error } = await supabase.from('notifications').insert(notification);
        if (error) console.error("Error inserting notification:", error);
      }
    }
    
    // Check existing employee registrations count for application status
    const { count: applicationCount, error: applicationError } = await supabase
      .from('employee_registrations')
      .select('*', { count: 'exact', head: true });
      
    if (applicationError) {
      console.error("Error checking employee_registrations:", applicationError);
      return;
    }
    
    // If we have fewer than 5 applications, add more
    if (!applicationCount || applicationCount < 5) {
      console.log("Seeding employee registration data for application status...");
      
      const statuses = ['approved', 'rejected', 'under-review'];
      const applications = [];
      
      for (let i = 0; i < 5; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const fullName = `${firstName} ${lastName}`;
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const randomDay = Math.floor(Math.random() * 30);
        
        applications.push({
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
          employee_id: `EMP${faker.string.numeric(3)}`,
          position: faker.person.jobTitle(),
          sex: Math.random() > 0.5 ? 'male' : 'female',
          status,
          area: faker.person.jobArea(),
          submission_date: faker.date.recent({ days: randomDay }).toISOString(),
          request_type: Math.random() > 0.7 ? 'New Registration' : 'Registration Update'
        });
      }
      
      // Insert the applications
      for (const application of applications) {
        const { error } = await supabase.from('employee_registrations').insert(application);
        if (error) console.error("Error inserting employee registration:", error);
      }
    }
    
    // Check existing employee requests
    const { count: employeeRequestCount, error: employeeRequestError } = await supabase
      .from('employee_requests')
      .select('*', { count: 'exact', head: true });
      
    if (employeeRequestError) {
      console.error("Error checking employee_requests:", employeeRequestError);
      return;
    }
    
    // If we have fewer than 5 employee requests, add more
    if (!employeeRequestCount || employeeRequestCount < 5) {
      console.log("Seeding employee requests data for application status...");
      
      const statuses = ['pending', 'approved', 'rejected'];
      const types = ['employee', 'company'];
      const requestTypes = ['New Registration', 'ID Renewal', 'Information Update'];
      const requests = [];
      
      for (let i = 0; i < 5; i++) {
        const employeeName = faker.person.fullName();
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const requestType = requestTypes[Math.floor(Math.random() * requestTypes.length)];
        const companyName = faker.company.name();
        
        requests.push({
          employee_name: employeeName,
          employee_id: `EMP${faker.string.numeric(4)}`,
          status,
          type,
          request_type: requestType,
          company_name: type === 'company' ? companyName : null,
          notes: Math.random() > 0.7 ? faker.lorem.sentence() : null,
          request_date: faker.date.recent({ days: 30 }).toISOString()
        });
      }
      
      // Insert the requests
      for (const request of requests) {
        const { error } = await supabase.from('employee_requests').insert(request);
        if (error) console.error("Error inserting employee request:", error);
      }
    }
    
    console.log("Application status demo data seeded successfully");
    
  } catch (error) {
    console.error("Error seeding application status data:", error);
  }
};

// Function to seed data specifically for Digital ID Management
const seedDigitalIDData = async () => {
  try {
    console.log("Seeding digital ID data for employee management...");
    
    // Check how many approved employees we already have
    const { count: existingCount, error: countError } = await supabase
      .from('employee_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');
      
    if (countError) {
      console.error("Error checking existing approved employees:", countError);
      return;
    }
    
    // Calculate how many more employees we need to add to get to 15
    const employeesToAdd = Math.max(0, 15 - (existingCount || 0));
    
    if (employeesToAdd <= 0) {
      console.log("Already have at least 15 approved employees, skipping seeding");
      return;
    }
    
    console.log(`Adding ${employeesToAdd} approved employees for digital ID management`);
    
    // Array of departments/areas
    const departments = [
      'Engineering', 'Finance', 'Human Resources', 'Marketing', 
      'Operations', 'Sales', 'Customer Support', 'Research', 
      'Legal', 'Product', 'Design', 'Administration'
    ];
    
    // Array of positions
    const positions = [
      'Manager', 'Specialist', 'Director', 'Coordinator', 
      'Analyst', 'Associate', 'Lead', 'Executive', 
      'Representative', 'Developer', 'Assistant', 'Supervisor'
    ];
    
    const statuses = ['approved', 'id_generated', 'id_printed', 'id_collected'];
    const sexOptions = ['male', 'female'];
    
    // Create new employees with diverse attributes
    const employees = [];
    
    for (let i = 0; i < employeesToAdd; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const fullName = `${firstName} ${lastName}`;
      const sex = sexOptions[Math.floor(Math.random() * sexOptions.length)];
      const area = departments[Math.floor(Math.random() * departments.length)];
      const position = positions[Math.floor(Math.random() * positions.length)] + ' - ' + area;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const employeeId = `EMP${faker.string.numeric(4)}`;
      
      // Different dates for different operations based on status
      const submissionDate = faker.date.recent({ days: 30 }).toISOString();
      let generatedAt = null;
      let printedAt = null;
      let collectedAt = null;
      let collectorName = null;
      let printed = false;
      
      if (status === 'id_generated' || status === 'id_printed' || status === 'id_collected') {
        generatedAt = faker.date.recent({ days: 25 }).toISOString();
      }
      
      if (status === 'id_printed' || status === 'id_collected') {
        printedAt = faker.date.recent({ days: 20 }).toISOString();
        printed = true;
      }
      
      if (status === 'id_collected') {
        collectedAt = faker.date.recent({ days: 15 }).toISOString();
        collectorName = faker.person.fullName();
      }
      
      employees.push({
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        employee_id: employeeId,
        position,
        sex,
        status,
        area,
        submission_date: submissionDate,
        request_type: Math.random() > 0.7 ? 'New Registration' : 'Registration Update',
        printed,
        printed_at: printedAt,
        collected_at: collectedAt,
        collector_name: collectorName,
        photo_url: Math.random() > 0.4 ? faker.image.avatar() : null
      });
    }
    
    // Insert the employees with batch insert
    for (const employee of employees) {
      const { error } = await supabase.from('employee_registrations').insert(employee);
      if (error) console.error("Error inserting employee for digital ID:", error);
    }
    
    console.log(`Successfully added ${employeesToAdd} employees for digital ID management`);
  } catch (error) {
    console.error("Error seeding digital ID data:", error);
  }
};
