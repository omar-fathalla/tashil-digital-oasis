
import { z } from "zod";

export const companyRegistrationSchema = z.object({
  // Company Information
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  address: z.string().min(10, {
    message: "Please enter the complete company address.",
  }),
  taxCardNumber: z.string().regex(/^\d{9}$/, {
    message: "Tax Card Number must be 9 digits.",
  }),
  commercialRegisterNumber: z.string().regex(/^\d{9}$/, {
    message: "Commercial Register Number must be 9 digits.",
  }),
  companyNumber: z.string().min(1, {
    message: "Company Number is required.",
  }),

  // Account Access
  username: z.string().min(4, {
    message: "Username must be at least 4 characters.",
  }),
  password: z.string()
    .min(4, "Password must be at least 4 characters")
    .max(12, "Password must not exceed 12 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type CompanyRegistrationFormData = z.infer<typeof companyRegistrationSchema>;
