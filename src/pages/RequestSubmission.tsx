
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, User, CreditCard, Upload, CheckCircle2 } from "lucide-react";

// Form schema
const formSchema = z.object({
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

const RequestSubmission = () => {
  const [formStep, setFormStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeName: "",
      employeeId: "",
      nationality: "",
      position: "",
      requestType: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setIsSubmitting(false);
      setIsCompleted(true);
    }, 1500);
  };
  
  if (isCompleted) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 py-12">
        <Card className="w-full max-w-lg border-none shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Request Submitted!</CardTitle>
            <CardDescription className="text-lg">
              Your request has been successfully submitted for processing.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-2 text-gray-600">
              Request Reference Number:
            </p>
            <p className="mb-6 font-mono font-medium text-lg">REQ-2025-04873</p>
            <p className="mb-6 text-gray-600">
              You can track the status of your request in the Application Status page.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/application-status">
                  Track Status
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/">Return Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-primary-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Request Submission</h1>
            <p className="text-lg text-gray-600">
              Submit a request for employee registration or other administrative services.
            </p>
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section className="py-12 bg-white flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Progress indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formStep === 0 ? 'bg-primary text-white' : 'bg-primary-100 text-primary'}`}>
                    <User className="h-5 w-5" />
                  </div>
                  <span className={`ml-3 text-sm font-medium ${formStep === 0 ? 'text-primary' : 'text-gray-500'}`}>Employee Information</span>
                </div>
                <div className="w-12 h-1 bg-gray-200">
                  <div className={`h-full bg-primary ${formStep > 0 ? 'w-full' : 'w-0'} transition-all`}></div>
                </div>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formStep === 1 ? 'bg-primary text-white' : formStep > 1 ? 'bg-primary-100 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                    <Upload className="h-5 w-5" />
                  </div>
                  <span className={`ml-3 text-sm font-medium ${formStep === 1 ? 'text-primary' : formStep > 1 ? 'text-primary' : 'text-gray-400'}`}>Documents</span>
                </div>
                <div className="w-12 h-1 bg-gray-200">
                  <div className={`h-full bg-primary ${formStep > 1 ? 'w-full' : 'w-0'} transition-all`}></div>
                </div>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formStep === 2 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <span className={`ml-3 text-sm font-medium ${formStep === 2 ? 'text-primary' : 'text-gray-400'}`}>Review</span>
                </div>
              </div>
            </div>
            
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>
                  {formStep === 0 && "Employee Information"}
                  {formStep === 1 && "Required Documents"}
                  {formStep === 2 && "Review Request"}
                </CardTitle>
                <CardDescription>
                  {formStep === 0 && "Enter employee and request details"}
                  {formStep === 1 && "Upload the required documents"}
                  {formStep === 2 && "Verify all information before submission"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {formStep === 0 && (
                      <>
                        <FormField
                          control={form.control}
                          name="employeeName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Employee Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter employee name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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
                          name="nationality"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nationality</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select nationality" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="saudi">Saudi Arabia</SelectItem>
                                  <SelectItem value="uae">United Arab Emirates</SelectItem>
                                  <SelectItem value="egypt">Egypt</SelectItem>
                                  <SelectItem value="jordan">Jordan</SelectItem>
                                  <SelectItem value="lebanon">Lebanon</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
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
                              <FormControl>
                                <Input placeholder="Enter job position" {...field} />
                              </FormControl>
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
                                  <SelectItem value="new-registration">New Employee Registration</SelectItem>
                                  <SelectItem value="id-renewal">ID Renewal</SelectItem>
                                  <SelectItem value="information-update">Information Update</SelectItem>
                                  <SelectItem value="employment-termination">Employment Termination</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {formStep === 1 && (
                      <>
                        <div className="space-y-6">
                          {/* ID Document */}
                          <div>
                            <h3 className="font-medium mb-2">ID / Passport Copy</h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500 mb-2">
                                Upload a copy of the employee's ID or passport
                              </p>
                              <p className="text-xs text-gray-400 mb-4">
                                PDF, JPG, or PNG (max. 5MB)
                              </p>
                              <Input 
                                type="file" 
                                className="hidden" 
                                id="id-upload"
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                              <Button variant="outline" className="text-sm" onClick={() => document.getElementById('id-upload')?.click()}>
                                Select File
                              </Button>
                            </div>
                          </div>

                          {/* Authorization Document */}
                          <div>
                            <h3 className="font-medium mb-2">Authorization Letter</h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500 mb-2">
                                Upload company authorization letter
                              </p>
                              <p className="text-xs text-gray-400 mb-4">
                                PDF, JPG, or PNG (max. 5MB)
                              </p>
                              <Input 
                                type="file" 
                                className="hidden" 
                                id="auth-upload"
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                              <Button variant="outline" className="text-sm" onClick={() => document.getElementById('auth-upload')?.click()}>
                                Select File
                              </Button>
                            </div>
                          </div>

                          {/* Receipt Document */}
                          <div>
                            <h3 className="font-medium mb-2">Payment Receipt</h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500 mb-2">
                                Upload payment receipt for service fees
                              </p>
                              <p className="text-xs text-gray-400 mb-4">
                                PDF, JPG, or PNG (max. 5MB)
                              </p>
                              <Input 
                                type="file" 
                                className="hidden" 
                                id="receipt-upload"
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                              <Button variant="outline" className="text-sm" onClick={() => document.getElementById('receipt-upload')?.click()}>
                                Select File
                              </Button>
                            </div>
                          </div>

                          {/* Photo Upload */}
                          <div>
                            <h3 className="font-medium mb-2">Employee Photo</h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500 mb-2">
                                Upload employee photo (recent, passport-sized)
                              </p>
                              <p className="text-xs text-gray-400 mb-4">
                                JPG or PNG (max. 2MB)
                              </p>
                              <Input 
                                type="file" 
                                className="hidden" 
                                id="photo-upload"
                                accept=".jpg,.jpeg,.png"
                              />
                              <Button variant="outline" className="text-sm" onClick={() => document.getElementById('photo-upload')?.click()}>
                                Select File
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {formStep === 2 && (
                      <div className="space-y-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-medium mb-3">Employee Information</h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Employee Name</p>
                              <p className="font-medium">{form.getValues("employeeName") || "Not provided"}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Employee ID</p>
                              <p className="font-medium">{form.getValues("employeeId") || "Not provided"}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Nationality</p>
                              <p className="font-medium">{form.getValues("nationality") || "Not provided"}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Position</p>
                              <p className="font-medium">{form.getValues("position") || "Not provided"}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Request Type</p>
                              <p className="font-medium">{form.getValues("requestType") || "Not provided"}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-medium mb-3">Uploaded Documents</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">ID / Passport Copy</span>
                              <span className="text-sm text-green-600 font-medium flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Uploaded
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Authorization Letter</span>
                              <span className="text-sm text-green-600 font-medium flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Uploaded
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Payment Receipt</span>
                              <span className="text-sm text-green-600 font-medium flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Uploaded
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Employee Photo</span>
                              <span className="text-sm text-green-600 font-medium flex items-center">
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Uploaded
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800">
                            By submitting this request, you confirm that all provided information is accurate
                            and you have authorization to submit this request on behalf of your company.
                          </p>
                        </div>
                      </div>
                    )}
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-between">
                {formStep > 0 ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setFormStep(formStep - 1)}
                  >
                    Previous
                  </Button>
                ) : (
                  <div></div>
                )}
                {formStep < 2 ? (
                  <Button 
                    onClick={() => {
                      if (formStep === 0) {
                        form.trigger(['employeeName', 'employeeId', 'nationality', 'position', 'requestType']);
                        const isValid = !form.formState.errors.employeeName && !form.formState.errors.employeeId && !form.formState.errors.nationality && !form.formState.errors.position && !form.formState.errors.requestType;
                        if (isValid) setFormStep(1);
                      } else {
                        setFormStep(2);
                      }
                    }}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button 
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RequestSubmission;
