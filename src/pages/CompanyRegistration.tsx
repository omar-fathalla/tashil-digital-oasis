
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
import { ArrowRight, CheckCircle, Upload, Building, User, Mail, Phone } from "lucide-react";

// Form schema
const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  licenseNumber: z.string().min(4, {
    message: "License number must be at least 4 characters.",
  }),
  licenseType: z.string({
    required_error: "Please select a license type.",
  }),
  contactPerson: z.string().min(2, {
    message: "Contact person name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(8, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  requestTypes: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You must select at least one request type.",
  }),
  agreeTerms: z.boolean().refine((val) => val, {
    message: "You must agree to the terms and conditions.",
  }),
});

const CompanyRegistration = () => {
  const [formStep, setFormStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      licenseNumber: "",
      licenseType: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      requestTypes: [],
      agreeTerms: false,
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

  // Request types options
  const requestTypes = [
    {
      id: "employee-registration",
      label: "Employee Registration",
    },
    {
      id: "document-management",
      label: "Document Management",
    },
    {
      id: "digital-id",
      label: "Digital ID Issuance",
    },
    {
      id: "reporting",
      label: "Reporting and Archiving",
    },
  ];
  
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
          <CardContent className="text-center">
            <p className="mb-6 text-gray-600">
              We have sent a confirmation email with your registration details.
              You can now submit service requests for your company.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/request-submission">
                  Submit Request
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Company Registration</h1>
            <p className="text-lg text-gray-600">
              Register your company to access Tashil Platform's digital administrative services.
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-12 bg-white flex-1">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Progress indicator */}
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
                  <span className={`ml-3 text-sm font-medium ${formStep === 1 ? 'text-primary' : formStep > 1 ? 'text-primary' : 'text-gray-400'}`}>Contact Information</span>
                </div>
                <div className="w-12 h-1 bg-gray-200">
                  <div className={`h-full bg-primary ${formStep > 1 ? 'w-full' : 'w-0'} transition-all`}></div>
                </div>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formStep === 2 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Upload className="h-5 w-5" />
                  </div>
                  <span className={`ml-3 text-sm font-medium ${formStep === 2 ? 'text-primary' : 'text-gray-400'}`}>Authorization</span>
                </div>
              </div>
            </div>
            
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>
                  {formStep === 0 && "Company Information"}
                  {formStep === 1 && "Contact Details"}
                  {formStep === 2 && "Authorization & Services"}
                </CardTitle>
                <CardDescription>
                  {formStep === 0 && "Enter your company's basic information"}
                  {formStep === 1 && "Provide contact person details"}
                  {formStep === 2 && "Upload authorization and select services"}
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
                                <Input placeholder="Enter your company name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="licenseNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business License Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter license number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="licenseType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business License Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select license type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="commercial">Commercial</SelectItem>
                                  <SelectItem value="industrial">Industrial</SelectItem>
                                  <SelectItem value="professional">Professional</SelectItem>
                                  <SelectItem value="service">Service Provider</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
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
                                <Textarea placeholder="Enter company address" {...field} />
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
                          name="contactPerson"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Person Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter email address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {formStep === 2 && (
                      <>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium mb-2">Upload Official Authorization</h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500 mb-2">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-gray-400">
                                PDF, JPG, or PNG (max. 5MB)
                              </p>
                              <Input 
                                type="file" 
                                className="hidden" 
                                id="file-upload"
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                              <Button variant="outline" className="mt-4" onClick={() => document.getElementById('file-upload')?.click()}>
                                Select File
                              </Button>
                            </div>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="requestTypes"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel>Select types of requests to be submitted</FormLabel>
                                  <FormDescription>
                                    Choose the services you'd like to access
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {requestTypes.map((item) => (
                                    <FormField
                                      key={item.id}
                                      control={form.control}
                                      name="requestTypes"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={item.id}
                                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, item.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== item.id
                                                        )
                                                      )
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer">
                                              {item.label}
                                            </FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="agreeTerms"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    I agree to the <Link to="/terms" className="text-primary hover:underline">terms of service</Link> and <Link to="/privacy" className="text-primary hover:underline">privacy policy</Link>
                                  </FormLabel>
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </>
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
                        form.trigger(['companyName', 'licenseNumber', 'licenseType', 'address']);
                        const isValid = !form.formState.errors.companyName && !form.formState.errors.licenseNumber && !form.formState.errors.licenseType && !form.formState.errors.address;
                        if (isValid) setFormStep(1);
                      } else if (formStep === 1) {
                        form.trigger(['contactPerson', 'email', 'phone']);
                        const isValid = !form.formState.errors.contactPerson && !form.formState.errors.email && !form.formState.errors.phone;
                        if (isValid) setFormStep(2);
                      }
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting}
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
