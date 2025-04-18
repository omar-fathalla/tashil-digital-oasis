
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Button, 
} from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle, Upload, Building, User, Mail, FileText, Image } from "lucide-react";
import { Outlet } from "react-router-dom";

// Form schema with enhanced validation
const formSchema = z.object({
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

const CompanyRegistration = () => {
  const [formStep, setFormStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    commercialRegister: null,
    taxCard: null,
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      address: "",
      taxCardNumber: "",
      commercialRegisterNumber: "",
      companyNumber: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    console.log("Form values:", values);
    console.log("Uploaded files:", uploadedFiles);
    
    // Simulate API call
    setTimeout(() => {
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
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Registration Successful!</CardTitle>
            <CardDescription className="text-lg">
              Your company has been successfully registered with Tashil Platform.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleFileUpload = (type: 'commercialRegister' | 'taxCard', file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: file
    }));
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="bg-primary-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Company Registration</h1>
            <p className="text-lg text-gray-600">
              Register your company to access Tashil Platform's digital administrative services.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formStep === 0 ? 'bg-primary text-white' : 'bg-primary-100 text-primary'}`}>
                    <Building className="h-5 w-5" />
                  </div>
                  <span className={`ml-3 text-sm font-medium ${formStep === 0 ? 'text-primary' : 'text-gray-500'}`}>Company Details</span>
                </div>
                <div className="w-12 h-1 bg-gray-200">
                  <div className={`h-full bg-primary ${formStep > 0 ? 'w-full' : 'w-0'} transition-all`}></div>
                </div>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formStep === 1 ? 'bg-primary text-white' : formStep > 1 ? 'bg-primary-100 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                    <User className="h-5 w-5" />
                  </div>
                  <span className={`ml-3 text-sm font-medium ${formStep === 1 ? 'text-primary' : formStep > 1 ? 'text-primary' : 'text-gray-400'}`}>Account Setup</span>
                </div>
                <div className="w-12 h-1 bg-gray-200">
                  <div className={`h-full bg-primary ${formStep > 1 ? 'w-full' : 'w-0'} transition-all`}></div>
                </div>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formStep === 2 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Upload className="h-5 w-5" />
                  </div>
                  <span className={`ml-3 text-sm font-medium ${formStep === 2 ? 'text-primary' : 'text-gray-400'}`}>Documents</span>
                </div>
              </div>
            </div>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>
                  {formStep === 0 && "Company Information"}
                  {formStep === 1 && "Account Access"}
                  {formStep === 2 && "Required Documents"}
                </CardTitle>
                <CardDescription>
                  {formStep === 0 && "Enter your company's basic information"}
                  {formStep === 1 && "Set up your company's account credentials"}
                  {formStep === 2 && "Upload the required documents"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {formStep === 0 && (
                      <>
                        <FormField
                          control={form.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter official company name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Address</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Enter complete company address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="taxCardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tax Card Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter 9-digit tax ID" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="commercialRegisterNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Commercial Register Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter 9-digit register number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="companyNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter Fathalla system company number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {formStep === 1 && (
                      <>
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Choose a username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Enter password (4-12 characters)" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Re-enter your password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {formStep === 2 && (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-medium mb-2">Commercial Register File</h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500 mb-2">
                                Upload a digital copy of the Commercial Register
                              </p>
                              <p className="text-xs text-gray-400 mb-4">
                                PDF or scanned image (max. 5MB)
                              </p>
                              <Input
                                type="file"
                                id="commercial-register"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload('commercialRegister', file);
                                }}
                              />
                              <Button 
                                variant="outline" 
                                onClick={() => document.getElementById('commercial-register')?.click()}
                              >
                                Select File
                              </Button>
                              {uploadedFiles.commercialRegister && (
                                <p className="mt-2 text-sm text-green-600">
                                  ✓ File uploaded: {uploadedFiles.commercialRegister.name}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium mb-2">Tax Card Image</h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Image className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500 mb-2">
                                Upload a clear image of the Tax Card
                              </p>
                              <p className="text-xs text-gray-400 mb-4">
                                JPG, PNG or PDF (max. 5MB)
                              </p>
                              <Input
                                type="file"
                                id="tax-card"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload('taxCard', file);
                                }}
                              />
                              <Button 
                                variant="outline" 
                                onClick={() => document.getElementById('tax-card')?.click()}
                              >
                                Select File
                              </Button>
                              {uploadedFiles.taxCard && (
                                <p className="mt-2 text-sm text-green-600">
                                  ✓ File uploaded: {uploadedFiles.taxCard.name}
                                </p>
                              )}
                            </div>
                          </div>
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
                        form.trigger(['companyName', 'address', 'taxCardNumber', 'commercialRegisterNumber', 'companyNumber']);
                        const isValid = !form.formState.errors.companyName && 
                                     !form.formState.errors.address && 
                                     !form.formState.errors.taxCardNumber && 
                                     !form.formState.errors.commercialRegisterNumber && 
                                     !form.formState.errors.companyNumber;
                        if (isValid) setFormStep(1);
                      } else if (formStep === 1) {
                        form.trigger(['username', 'password', 'confirmPassword']);
                        const isValid = !form.formState.errors.username && 
                                     !form.formState.errors.password && 
                                     !form.formState.errors.confirmPassword;
                        if (isValid) setFormStep(2);
                      }
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting || !uploadedFiles.commercialRegister || !uploadedFiles.taxCard}
                  >
                    {isSubmitting ? "Submitting..." : "Complete Registration"}
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

export default CompanyRegistration;

