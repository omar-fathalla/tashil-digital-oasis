
import { z } from "zod";

export const formSchema = z.object({
  employeeName: z.string().min(2, {
    message: "Employee name must be at least 2 characters.",
  }),
  employeeId: z.string().min(4, {
    message: "Employee ID must be at least 4 characters.",
  }),
  nationality: z.string({
    required_error: "Please select a nationality.",
  }),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  requestType: z.string({
    required_error: "Please select a request type.",
  }),
});

export type FormData = z.infer<typeof formSchema>;

export interface UploadedFiles {
  idDocument: File | null;
  authorizationLetter: File | null;
  paymentReceipt: File | null;
  employeePhoto: File | null;
}
