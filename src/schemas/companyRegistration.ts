
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

  // We're removing the Account Access fields since authentication happens earlier
  // username, password, confirmPassword fields are removed

  // File validation remains optional here as we'll handle it separately
  commercialRegisterFile: z.any().optional(),
  taxCardImage: z.any().optional()
});

export type CompanyRegistrationFormData = z.infer<typeof companyRegistrationSchema>;
