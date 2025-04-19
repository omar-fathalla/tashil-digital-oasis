
import { z } from "zod";

export const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  midName: z.string().min(2, {
    message: "Middle name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  employeeId: z.string().min(4, {
    message: "Employee ID must be at least 4 characters.",
  }),
  insuranceNumber: z.string().min(4, {
    message: "Insurance number must be at least 4 characters.",
  }),
  position: z.enum(["promoter", "superuser"], {
    required_error: "Please select a position.",
  }),
  requestType: z.string({
    required_error: "Please select a request type.",
  }),
  companyId: z.string({
    required_error: "Please select a company.",
  }),
  sex: z.enum(["male", "female"], {
    required_error: "Please select a gender.",
  }),
  area: z.enum(["alexandria", "cairo"], {
    required_error: "Please select an area.",
  }),
  photoUrl: z.string().optional(),
});

export type FormData = z.infer<typeof formSchema>;

export interface UploadedFiles {
  idDocument: File | null;
  authorizationLetter: File | null;
  paymentReceipt: File | null;
  employeePhoto: File | null;
}
