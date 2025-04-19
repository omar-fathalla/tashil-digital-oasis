import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { CompanySection } from "./form-sections/CompanySection";
import { PersonalInfoSection } from "./form-sections/PersonalInfoSection";
import { IdentificationSection } from "./form-sections/IdentificationSection";
import { GenderSection } from "./form-sections/GenderSection";
import { EmploymentSection } from "./form-sections/EmploymentSection";

interface EmployeeFormProps {
  form: UseFormReturn<FormData>;
  editMode?: boolean;
}

export const EmployeeForm = ({ form, editMode = false }: EmployeeFormProps) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<{ id: string, name: string }[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [requestTypes, setRequestTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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

        // Fetch predefined list of positions from the database
        const { data: positionsData, error: positionsError } = await supabase
          .from('employee_registrations')
          .select('position')
          .not('position', 'is', null);
          
        if (positionsError) throw positionsError;
        
        // Extract unique values
        const uniquePositions = [...new Set(positionsData.map(item => item.position))].filter(Boolean);
        
        // If no positions found, use fallback defaults
        if (uniquePositions.length === 0) {
          setPositions(['مهندس برمجيات', 'محاسب', 'مدير مبيعات', 'مسؤول موارد بشرية', 'فني صيانة', 'مندوب مبيعات', 'مدير مشروع', 'سكرتير تنفيذي', 'مدير عام', 'موظف إداري']);
        } else {
          setPositions(uniquePositions as string[]);
        }

        // Fetch areas from the database
        const { data: areasData, error: areasError } = await supabase
          .from('employee_registrations')
          .select('area')
          .not('area', 'is', null);
          
        if (areasError) throw areasError;
        
        // Extract unique values
        const uniqueAreas = [...new Set(areasData.map(item => item.area))].filter(Boolean);
        
        // If no areas found, use fallback defaults
        if (uniqueAreas.length === 0) {
          setAreas(['القاهرة', 'الإسكندرية', 'الجيزة', 'أسوان', 'المنصورة', 'شرم الشيخ', 'الساحل الشمالي']);
        } else {
          setAreas(uniqueAreas as string[]);
        }

        // Fetch request types from the database
        const { data: requestTypesData, error: requestTypesError } = await supabase
          .from('employee_registrations')
          .select('request_type')
          .not('request_type', 'is', null);
          
        if (requestTypesError) throw requestTypesError;
        
        // Extract unique values
        const uniqueRequestTypes = [...new Set(requestTypesData.map(item => item.request_type))].filter(Boolean);
        
        // If no request types found, use fallback defaults
        if (uniqueRequestTypes.length === 0) {
          setRequestTypes(['New Registration', 'Renewal', 'Information Update', 'Employment Termination']);
        } else {
          setRequestTypes(uniqueRequestTypes as string[]);
        }

        // If in edit mode and we have an ID, fetch employee data
        if (editMode && id) {
          const { data: employeeData, error: employeeError } = await supabase
            .from('employee_registrations')
            .select('*')
            .eq('id', id)
            .single();

          if (employeeError) throw employeeError;

          // Populate form with employee data
          if (employeeData) {
            form.reset({
              firstName: employeeData.first_name,
              midName: employeeData.mid_name || '',
              lastName: employeeData.last_name,
              employeeId: employeeData.employee_id,
              insuranceNumber: employeeData.insurance_number || '',
              position: employeeData.position,
              requestType: employeeData.request_type || '',
              companyId: employeeData.company_id || '',
              sex: employeeData.sex as "male" | "female" | undefined,
              area: employeeData.area,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError("Failed to load form data");
        toast.error("Failed to load form data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [editMode, id, form]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(6).fill(0).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-6 w-40 mb-2" />
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
      <CompanySection form={form} companies={companies} />
      <PersonalInfoSection form={form} />
      <IdentificationSection form={form} />
      <GenderSection form={form} />
      <EmploymentSection
        form={form}
        positions={positions}
        areas={areas}
        requestTypes={requestTypes}
      />
    </div>
  );
};
