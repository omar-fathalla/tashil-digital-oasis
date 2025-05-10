
import { supabase } from "@/integrations/supabase/client";
import { faker } from '@faker-js/faker';
import { toast } from "sonner";

export async function seedEmployeeData() {
  try {
    console.log("Starting to seed employee data...");
    
    // Array of departments/areas
    const departments = [
      'Engineering', 'Finance', 'Human Resources', 'Marketing', 
      'Operations', 'Sales', 'Customer Support', 'Research', 
      'Legal', 'Product', 'Design', 'Administration'
    ];
    
    // Array of positions by department
    const positionsByDepartment = {
      'Engineering': ['Software Engineer', 'DevOps Engineer', 'QA Engineer', 'Frontend Developer', 'Backend Developer'],
      'Finance': ['Financial Analyst', 'Accountant', 'Financial Controller', 'Payroll Specialist'],
      'Human Resources': ['HR Manager', 'Recruiter', 'Talent Acquisition Specialist', 'Benefits Coordinator'],
      'Marketing': ['Marketing Manager', 'Content Strategist', 'Digital Marketing Specialist', 'Brand Manager'],
      'Operations': ['Operations Manager', 'Project Manager', 'Business Analyst', 'Process Improvement Specialist'],
      'Sales': ['Sales Representative', 'Account Executive', 'Sales Manager', 'Business Development Manager'],
      'Customer Support': ['Customer Support Representative', 'Technical Support Specialist', 'Support Manager'],
      'Research': ['Research Scientist', 'Data Analyst', 'Research Director', 'Lab Technician'],
      'Legal': ['Legal Counsel', 'Compliance Officer', 'Legal Assistant', 'General Counsel'],
      'Product': ['Product Manager', 'Product Owner', 'UX Researcher', 'Product Marketing Manager'],
      'Design': ['UX Designer', 'Graphic Designer', 'UI Designer', 'Visual Designer'],
      'Administration': ['Administrative Assistant', 'Office Manager', 'Executive Assistant', 'Receptionist']
    };
    
    // Array of Egyptian company names
    const egyptianCompanies = [
      'NileSoft Technologies',
      'PyramidTech Solutions',
      'Alexandria Digital',
      'Cairo Systems',
      'Luxor Innovations',
      'Sphinx Software',
      'Delta IT Group',
      'Pharaoh Technologies',
      'Giza Solutions',
      'Aswan Tech',
      'Red Sea Systems',
      'Oasis Digital',
      'Egyptian Valley Tech',
      'Karnak Software',
      'Thebes Analytics'
    ];
    
    const statuses = ['active', 'on leave', 'probation', 'terminated'];
    const sexOptions = ['male', 'female'];
    
    // Profile photo placeholders
    const profilePlaceholders = [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
      'https://randomuser.me/api/portraits/men/1.jpg',
      'https://randomuser.me/api/portraits/women/1.jpg',
      'https://randomuser.me/api/portraits/men/2.jpg',
      'https://randomuser.me/api/portraits/women/2.jpg'
    ];
    
    const employees = [];
    
    // Create 15 employee records
    for (let i = 0; i < 15; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const fullName = `${firstName} ${lastName}`;
      const sex = sexOptions[Math.floor(Math.random() * sexOptions.length)];
      const area = departments[Math.floor(Math.random() * departments.length)];
      const position = positionsByDepartment[area][Math.floor(Math.random() * positionsByDepartment[area].length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const employeeId = `EMP${faker.string.numeric(4)}`;
      const companyName = egyptianCompanies[Math.floor(Math.random() * egyptianCompanies.length)];
      
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
      
      const employee = {
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
        emergency_phone: faker.phone.number(),
        company_name: companyName
      };
      
      employees.push(employee);
      console.log(`Generated employee ${i+1}:`, employee);
    }
    
    console.log(`Generated ${employees.length} employee records, preparing to insert...`);
    
    // Use RLS bypass to insert data (needed if RLS policies are in place)
    // By using the service role key instead of anon key for admin-like operations
    const { data: { session } } = await supabase.auth.getSession();
    
    // Insert employees one by one
    let successCount = 0;
    for (const employee of employees) {
      console.log(`Attempting to insert employee: ${employee.full_name}`);
      
      const { data, error } = await supabase
        .from('employee_registrations')
        .insert(employee)
        .select();
      
      if (error) {
        console.error("Error inserting employee:", error);
      } else {
        console.log("Successfully inserted employee:", data);
        successCount++;
      }
    }
    
    console.log(`Successfully inserted ${successCount} out of ${employees.length} employees`);
    toast.success(`Successfully added ${successCount} employees to directory`);
    return successCount;
    
  } catch (error) {
    console.error("Error seeding employee data:", error);
    toast.error("Failed to add employee data");
    return 0;
  }
}
