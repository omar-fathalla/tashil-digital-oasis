
import { supabase } from "@/integrations/supabase/client";
import { faker } from '@faker-js/faker';

// This function checks if we need to seed demo data and does so if needed
export const ensureDemoData = async () => {
  try {
    // Check if we already have companies and employees
    const { count: existingCompanies, error: companyCheckError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });
    
    if (companyCheckError) {
      console.error("Error checking companies:", companyCheckError);
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
    if (existingCompanies && existingCompanies > 0 && employeeCount && employeeCount > 0) {
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
      
      // Check if we have at least 15 employees with detailed profiles
      const { count: detailedCount, error: detailedError } = await supabase
        .from('employee_registrations')
        .select('*', { count: 'exact', head: true })
        .not('email', 'is', null); // Check for a field that should be in detailed records
        
      if (detailedError) {
        console.error("Error checking detailed employees:", detailedError);
      } else if (!detailedCount || detailedCount < 15) {
        console.log("Seeding detailed employee data");
        await seedDetailedEmployeeData();
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
    
    // Add detailed employee data
    await seedDetailedEmployeeData();
    
    // Add notifications and application status data
    await seedApplicationStatusData();
    
    // Add digital ID data
    await seedDigitalIDData();
    
    // Check existing company data count and add Egyptian companies
    const { count: companyDataCount, error: companyDataError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });
    
    if (companyDataError) {
      console.error("Error checking companies:", companyDataError);
      return;
    }
    
    // If we have fewer than 5 companies, add Egyptian companies
    if (!companyDataCount || companyDataCount < 5) {
      console.log("Seeding Egyptian company data...");
      await seedEgyptianCompanyData();
    }
    
    console.log("Demo data seeded successfully");
    
  } catch (error) {
    console.error("Error seeding demo data:", error);
  }
};

// Updated Egyptian company data seeding function with more realistic data
const seedEgyptianCompanyData = async () => {
  try {
    // Egyptian company names, addresses and more specific data
    const egyptianCompanies = [
      {
        name: 'NileWare Technologies',
        address: '15 Tahrir Square, Cairo',
        registerNumber: 'REG-1001',
        taxCardNumber: 'TAX-5823',
        companyNumber: 'EGY-7124'
      },
      {
        name: 'CairoByte Software',
        address: '27 El-Giza Street, Giza',
        registerNumber: 'REG-1002',
        taxCardNumber: 'TAX-6134',
        companyNumber: 'EGY-8235'
      },
      {
        name: 'Luxor Innovations',
        address: '8 Valley of Kings Road, Luxor',
        registerNumber: 'REG-1003',
        taxCardNumber: 'TAX-9472',
        companyNumber: 'EGY-3469'
      },
      {
        name: 'DeltaCorp Solutions',
        address: '41 Corniche Road, Alexandria',
        registerNumber: 'REG-1004',
        taxCardNumber: 'TAX-2857',
        companyNumber: 'EGY-5762'
      },
      {
        name: 'Pharos Solutions',
        address: '12 El-Nasr Street, Aswan',
        registerNumber: 'REG-1005',
        taxCardNumber: 'TAX-1498',
        companyNumber: 'EGY-9213'
      }
    ];
    
    const companies = [];
    
    // Generate companies with realistic dates between January and April 2025
    for (let i = 0; i < egyptianCompanies.length; i++) {
      const company = egyptianCompanies[i];
      
      // Create date between Jan 1, 2025 and April 30, 2025
      const createdAt = faker.date.between({
        from: new Date('2025-01-01'),
        to: new Date('2025-04-30')
      }).toISOString();
      
      companies.push({
        company_name: company.name,
        address: company.address,
        register_number: company.registerNumber,
        tax_card_number: company.taxCardNumber,
        company_number: company.companyNumber,
        created_at: createdAt,
        updated_at: createdAt,
        is_dummy: false,
        is_archived: false,
        user_id: await getCurrentUserId()
      });
    }
    
    // Insert the companies
    for (const company of companies) {
      const { error } = await supabase.from('companies').insert(company);
      if (error) console.error("Error inserting Egyptian company:", error);
    }
    
    console.log("Egyptian company data seeded successfully");
  } catch (error) {
    console.error("Error seeding Egyptian company data:", error);
  }
};

// Helper function to get current user ID
const getCurrentUserId = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || '00000000-0000-0000-0000-000000000000'; // Fallback ID if no user
  } catch (error) {
    console.error("Error getting current user:", error);
    return '00000000-0000-0000-0000-000000000000';
  }
};

// Add this function to the existing seedApplicationStatusData function
const seedCompanyRequestsData = async () => {
  try {
    // Check existing company requests count
    const { count: existingRequests, error: requestQueryError } = await supabase
      .from('employee_requests')
      .select('*', { count: 'exact', head: true })
      .eq('type', 'company');
      
    if (requestQueryError) {
      console.error("Error checking company requests:", requestQueryError);
      return;
    }
    
    // If we have fewer than 5 company requests, add more
    if (!existingRequests || existingRequests < 5) {
      console.log("Seeding company requests data...");
      
      const egyptianCompanies = [
        'NileWare Technologies',
        'DeltaCorp Solutions',
        'Luxor Innovations',
        'CairoByte Software',
        'Pharos Solutions',
        'Alexandria Digital',
        'Giza Tech Systems',
        'Aswan Data Services',
        'Sphinx Cybersecurity',
        'Red Sea Cloud Computing'
      ];
      
      const egyptianNames = [
        'Ahmed Mohamed',
        'Fatima Ibrahim',
        'Omar Hassan',
        'Layla Ahmed',
        'Karim Mahmoud',
        'Nour Ali',
        'Mostafa Youssef',
        'Aisha Mahmoud',
        'Tarek Hussein',
        'Mariam Abdel'
      ];
      
      const statuses = ['pending', 'approved', 'rejected'];
      const requestTypes = ['Company Registration', 'Information Update', 'Document Submission'];
      const requests = [];
      
      for (let i = 0; i < 5; i++) {
        const companyName = egyptianCompanies[i];
        const contactName = egyptianNames[i];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const requestType = requestTypes[Math.floor(Math.random() * requestTypes.length)];
        const companyNumber = `EG-${2024}${String(i+1).padStart(4, '0')}`;
        
        requests.push({
          employee_name: contactName,
          employee_id: companyNumber,
          status,
          type: 'company',
          request_type: requestType,
          company_name: companyName,
          company_number: companyNumber,
          tax_card_number: `TAX${2024}${String(i+1).padStart(4, '0')}`,
          commercial_register_number: `CR${2024}${String(i+1).padStart(4, '0')}`,
          notes: Math.random() > 0.7 ? `Additional information about ${companyName} registration request` : null,
          request_date: faker.date.recent({ days: 30 }).toISOString()
        });
      }
      
      // Insert the requests
      for (const request of requests) {
        const { error } = await supabase.from('employee_requests').insert(request);
        if (error) console.error("Error inserting company request:", error);
      }
      
      console.log("Company requests data seeded successfully");
    }
  } catch (error) {
    console.error("Error seeding company requests data:", error);
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
    
    // Seed company requests data
    await seedCompanyRequestsData();
    
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

// Function to seed detailed employee data for Employee Management
const seedDetailedEmployeeData = async () => {
  try {
    console.log("Seeding detailed employee data for Employee Management...");
    
    // Check how many employees with detailed profiles we already have
    const { count: existingCount, error: countError } = await supabase
      .from('employee_registrations')
      .select('*', { count: 'exact', head: true })
      .not('email', 'is', null); // Check for a field that should be in detailed records
      
    if (countError) {
      console.error("Error checking existing detailed employees:", countError);
      return;
    }
    
    // Calculate how many more employees we need to add to get to 15
    const employeesToAdd = Math.max(0, 15 - (existingCount || 0));
    
    if (employeesToAdd <= 0) {
      console.log("Already have at least 15 detailed employees, skipping seeding");
      return;
    }
    
    console.log(`Adding ${employeesToAdd} detailed employee profiles`);
    
    // Array of departments/areas
    const departments = [
      'Engineering', 'Finance', 'Human Resources', 'Marketing', 
      'Operations', 'Sales', 'Customer Support', 'Research', 
      'Legal', 'Product', 'Design', 'Administration'
    ];
    
    // Array of positions by department
    const positionsByDepartment = {
      'Engineering': ['Software Engineer', 'DevOps Engineer', 'QA Engineer', 'CTO', 'Frontend Developer', 'Backend Developer'],
      'Finance': ['Financial Analyst', 'Accountant', 'CFO', 'Payroll Specialist', 'Financial Controller'],
      'Human Resources': ['HR Manager', 'Recruiter', 'Talent Acquisition Specialist', 'HR Director', 'Benefits Coordinator'],
      'Marketing': ['Marketing Manager', 'Content Strategist', 'Digital Marketing Specialist', 'Brand Manager', 'CMO'],
      'Operations': ['Operations Manager', 'Project Manager', 'Business Analyst', 'COO', 'Process Improvement Specialist'],
      'Sales': ['Sales Representative', 'Account Executive', 'Sales Manager', 'Business Development Manager', 'Sales Director'],
      'Customer Support': ['Customer Support Representative', 'Technical Support Specialist', 'Support Manager', 'Customer Success Manager'],
      'Research': ['Research Scientist', 'Data Analyst', 'Research Director', 'Lab Technician', 'Clinical Trial Manager'],
      'Legal': ['Legal Counsel', 'Compliance Officer', 'Patent Attorney', 'Legal Assistant', 'General Counsel'],
      'Product': ['Product Manager', 'Product Owner', 'UX Researcher', 'Product Director', 'Product Marketing Manager'],
      'Design': ['UX Designer', 'Graphic Designer', 'UI Designer', 'Creative Director', 'Visual Designer'],
      'Administration': ['Administrative Assistant', 'Office Manager', 'Executive Assistant', 'Receptionist', 'Facilities Manager']
    };
    
    const statuses = ['active', 'on leave', 'probation', 'inactive', 'suspended'];
    const sexOptions = ['male', 'female'];
    
    // Profile photo placeholders
    const profilePlaceholders = [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
      'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
      'https://randomuser.me/api/portraits/men/1.jpg',
      'https://randomuser.me/api/portraits/women/1.jpg',
      'https://randomuser.me/api/portraits/men/2.jpg',
      'https://randomuser.me/api/portraits/women/2.jpg'
    ];
    
    // Create new employees with diverse attributes
    const employees = [];
    
    for (let i = 0; i < employeesToAdd; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const fullName = `${firstName} ${lastName}`;
      const sex = sexOptions[Math.floor(Math.random() * sexOptions.length)];
      const area = departments[Math.floor(Math.random() * departments.length)];
      const position = positionsByDepartment[area][Math.floor(Math.random() * positionsByDepartment[area].length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const employeeId = `EMP${faker.string.numeric(4)}`;
      
      // Generate random dates
      const hireDate = faker.date.past({ years: 5 }).toISOString();
      const submissionDate = faker.date.recent({ days: 30 }).toISOString();
      
      // Generate contact information
      const email = faker.internet.email({ firstName, lastName, provider: 'company.com' }).toLowerCase();
      const phoneNumber = faker.phone.number();
      const address = faker.location.streetAddress();
      const city = faker.location.city();
      const state = faker.location.state();
      const zipCode = faker.location.zipCode();
      
      // Select a random profile photo placeholder
      const photoUrl = profilePlaceholders[Math.floor(Math.random() * profilePlaceholders.length)];
      
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
        hire_date: hireDate,
        request_type: Math.random() > 0.7 ? 'New Registration' : 'Registration Update',
        email,
        phone: phoneNumber,
        address,
        city,
        state,
        zip_code: zipCode,
        photo_url: photoUrl,
        national_id: faker.string.numeric(9),
        insurance_number: faker.string.numeric(10),
        emergency_contact: faker.person.fullName(),
        emergency_phone: faker.phone.number()
      });
    }
    
    // Insert the employees with batch insert
    for (const employee of employees) {
      const { error } = await supabase.from('employee_registrations').insert(employee);
      if (error) console.error("Error inserting detailed employee:", error);
    }
    
    console.log(`Successfully added ${employeesToAdd} detailed employee profiles`);
  } catch (error) {
    console.error("Error seeding detailed employee data:", error);
  }
};
