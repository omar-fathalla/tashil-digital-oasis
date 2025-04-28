import { z } from "zod";

export const companyRegistrationSchema = z.object({
  // User Account Information
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  username: z.string().min(1, {
    message: "Username is required",
  }).min(3, {
    message: "Username must be at least 3 characters",
  }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
  mobileNumber: z.string()
    .min(1, { message: "Mobile number is required" })
    .regex(/^[0-9]{10,15}$/, {
      message: "Mobile number must be between 10-15 digits, numbers only",
    })
    .transform(val => val.replace(/[\s-]/g, '')), // Remove spaces and dashes

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
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type CompanyRegistrationFormData = z.infer<typeof companyRegistrationSchema>;
