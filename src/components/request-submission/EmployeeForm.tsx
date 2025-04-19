
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./types";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmployeeFormProps {
  form: UseFormReturn<FormData>;
  editMode?: boolean;
}

export const EmployeeForm = ({ form, editMode = false }: EmployeeFormProps) => {
  const [companies, setCompanies] = useState<{ id: string, name: string }[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [requestTypes, setRequestTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, company_name');

        if (error) {
          throw error;
        } else {
          setCompanies(data.map(company => ({
            id: company.id,
            name: company.company_name
          })));
        }
      } catch (error: any) {
        console.error('Error fetching companies:', error);
        setError("Failed to load company data");
        toast.error("Failed to load company data");
      }
    };

    // Fetch predefined list of positions from the database
    const fetchPositions = async () => {
      try {
        // Get distinct positions from employee_registrations
        const { data, error } = await supabase
          .from('employee_registrations')
          .select('position')
          .not('position', 'is', null);
          
        if (error) throw error;
        
        // Extract unique values
        const uniquePositions = [...new Set(data.map(item => item.position))].filter(Boolean);
        
        // If no positions found, use fallback defaults
        if (uniquePositions.length === 0) {
          setPositions(['مهندس برمجيات', 'محاسب', 'مدير مبيعات', 'مسؤول موارد بشرية', 'فني صيانة', 'مندوب مبيعات', 'مدير مشروع', 'سكرتير تنفيذي', 'مدير عام', 'موظف إداري']);
        } else {
          setPositions(uniquePositions as string[]);
        }
      } catch (error) {
        console.error('Error fetching positions:', error);
        // Fallback to defaults
        setPositions(['promoter', 'superuser']);
      }
    };

    // Fetch areas from the database
    const fetchAreas = async () => {
      try {
        // Get distinct areas from employee_registrations
        const { data, error } = await supabase
          .from('employee_registrations')
          .select('area')
          .not('area', 'is', null);
          
        if (error) throw error;
        
        // Extract unique values
        const uniqueAreas = [...new Set(data.map(item => item.area))].filter(Boolean);
        
        // If no areas found, use fallback defaults
        if (uniqueAreas.length === 0) {
          setAreas(['القاهرة', 'الإسكندرية', 'الجيزة', 'أسوان', 'المنصورة', 'شرم الشيخ', 'الساحل الشمالي']);
        } else {
          setAreas(uniqueAreas as string[]);
        }
      } catch (error) {
        console.error('Error fetching areas:', error);
        // Fallback to defaults
        setAreas(['alexandria', 'cairo']);
      }
    };

    // Fetch request types from the database
    const fetchRequestTypes = async () => {
      try {
        // Get distinct request types from employee_registrations
        const { data, error } = await supabase
          .from('employee_registrations')
          .select('request_type')
          .not('request_type', 'is', null);
          
        if (error) throw error;
        
        // Extract unique values
        const uniqueRequestTypes = [...new Set(data.map(item => item.request_type))].filter(Boolean);
        
        // If no request types found, use fallback defaults
        if (uniqueRequestTypes.length === 0) {
          setRequestTypes(['New Registration', 'Renewal', 'Information Update', 'Employment Termination']);
        } else {
          setRequestTypes(uniqueRequestTypes as string[]);
        }
      } catch (error) {
        console.error('Error fetching request types:', error);
        // Fallback to defaults
        setRequestTypes([
          'new-registration', 
          'id-renewal', 
          'information-update', 
          'employment-termination'
        ]);
      }
    };

    // If in edit mode and we have an ID, fetch employee data to populate the form
    const fetchEmployeeData = async () => {
      if (!editMode || !id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('employee_registrations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Populate form with employee data
        if (data) {
          form.reset({
            firstName: data.first_name,
            midName: data.mid_name || '',
            lastName: data.last_name,
            employeeId: data.employee_id,
            insuranceNumber: data.insurance_number || '',
            position: data.position,
            requestType: data.request_type || '',
            companyId: data.company_id || '',
            sex: data.sex as "male" | "female" | undefined,
            area: data.area,
          });
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setError("Failed to load employee data");
        toast.error("Failed to load employee data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
    fetchPositions();
    fetchAreas();
    fetchRequestTypes();
    fetchEmployeeData();
  }, [editMode, id, form]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(6).fill(0).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="companyId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="midName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Middle Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter middle name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="employeeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Employee ID / National ID</FormLabel>
            <FormControl>
              <Input placeholder="Enter ID number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="insuranceNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Insurance Number</FormLabel>
            <FormControl>
              <Input placeholder="Enter insurance number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sex"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Sex</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="position"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Position</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="area"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Area</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="requestType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Request Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {requestTypes.map((requestType) => (
                  <SelectItem key={requestType} value={requestType}>
                    {requestType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
