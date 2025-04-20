
import { z } from "zod";

export const companyRegistrationSchema = z.object({
  // Company Information
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  address: z.string().optional(),
  taxCardNumber: z.string().regex(/^\d{9}$/, {
    message: "Tax Card Number must be exactly 9 digits.",
  }),
  registerNumber: z.string().regex(/^\d{9}$/, {
    message: "Commercial Register Number must be exactly 9 digits.",
  }),
  companyNumber: z.string().optional(),

  // Account Access
  username: z.string()
    .min(4, { message: "Username must be at least 4 characters." })
    .max(50, { message: "Username must not exceed 50 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, { 
      message: "Username can only contain letters, numbers, and underscores." 
    }),
  password: z.string()
    .min(4, "Password must be at least 4 characters")
    .max(12, "Password must not exceed 12 characters"),
  confirmPassword: z.string(),

  // File Uploads
  commercialRegisterFile: z.instanceof(File).refine(file => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize && validTypes.includes(file.type);
  }, {
    message: "Commercial Register File must be PDF, JPG, or PNG, and less than 5MB."
  }),
  taxCardImage: z.instanceof(File).refine(file => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize && validTypes.includes(file.type);
  }, {
    message: "Tax Card Image must be PDF, JPG, or PNG, and less than 5MB."
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type CompanyRegistrationFormData = z.infer<typeof companyRegistrationSchema>;
