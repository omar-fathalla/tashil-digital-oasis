
import { z } from "zod";

export const companyRegistrationSchema = z.object({
  // Company Information
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  taxCardNumber: z.string().regex(/^\d{9}$/, {
    message: "Tax Card Number must be exactly 9 digits.",
  }),
  registerNumber: z.string().regex(/^\d{9}$/, {
    message: "Commercial Register Number must be exactly 9 digits.",
  }),
  companyNumber: z.string().regex(/^\d{5,10}$/, {
    message: "Company Number must be between 5 and 10 digits.",
  }),

  // File validation 
  commercialRegisterFile: z.any()
    .refine((file) => file !== null, "Commercial Register file is required")
    .refine(
      (file) => file?.size <= 5000000,
      "Max file size is 5MB"
    ),
  taxCardImage: z.any()
    .refine((file) => file !== null, "Tax Card image is required")
    .refine(
      (file) => file?.size <= 5000000,
      "Max file size is 5MB"
    )
});

export type CompanyRegistrationFormData = z.infer<typeof companyRegistrationSchema>;
