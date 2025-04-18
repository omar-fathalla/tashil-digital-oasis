
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, Clock, FileCheck, UserPlus, FileText, Database, Headphones } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  Transforming Administrative Procedures <span className="text-secondary-300">Digitally</span>
                </h1>
                <p className="text-lg md:text-xl opacity-85 max-w-lg">
                  Experience a seamless, paperless administrative workflow with the Tashil Platform. Save time, increase accuracy, and enhance security.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/company-registration">
                    Register Your Company
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20" asChild>
                  <Link to="/services">Explore Services</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500 rounded-lg rotate-3 scale-105 opacity-20"></div>
                <img
                  src="/placeholder.svg" 
                  alt="Digital Transformation"
                  className="relative z-10 rounded-lg shadow-xl"
                  style={{ width: '500px', height: '350px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Benefits of Digital Transformation</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Embracing digital transformation with Tashil brings numerous advantages to your administrative workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Speed */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-primary-50">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Speed</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Reduce processing time from weeks to minutes with automated workflows and digital verification.
                </p>
              </CardContent>
            </Card>
            
            {/* Accuracy */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-primary-50">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Eliminate human errors with smart validation systems and data verification tools.
                </p>
              </CardContent>
            </Card>
            
            {/* Security */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-primary-50">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Security</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Protect sensitive information with advanced encryption and role-based access controls.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions to streamline your administrative procedures
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <Link to="/services" className="group">
              <Card className="h-full transition-all border-border/50 hover:border-primary hover:shadow-md">
                <CardHeader className="pb-2">
                  <UserPlus className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Employee Registration</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600">
                    Streamlined employee data management and ID issuance
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <span className="text-primary text-sm font-medium group-hover:underline">Learn more</span>
                </CardFooter>
              </Card>
            </Link>
            
            <Link to="/services" className="group">
              <Card className="h-full transition-all border-border/50 hover:border-primary hover:shadow-md">
                <CardHeader className="pb-2">
                  <FileText className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Document Management</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600">
                    Secure storage and retrieval of important documents
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <span className="text-primary text-sm font-medium group-hover:underline">Learn more</span>
                </CardFooter>
              </Card>
            </Link>
            
            <Link to="/services" className="group">
              <Card className="h-full transition-all border-border/50 hover:border-primary hover:shadow-md">
                <CardHeader className="pb-2">
                  <Database className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Digital ID Issuance</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600">
                    Create and manage secure digital identification
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <span className="text-primary text-sm font-medium group-hover:underline">Learn more</span>
                </CardFooter>
              </Card>
            </Link>
            
            <Link to="/services" className="group">
              <Card className="h-full transition-all border-border/50 hover:border-primary hover:shadow-md">
                <CardHeader className="pb-2">
                  <Zap className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Reporting Tools</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600">
                    Comprehensive analytics and performance tracking
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <span className="text-primary text-sm font-medium group-hover:underline">Learn more</span>
                </CardFooter>
              </Card>
            </Link>
            
            <Link to="/services" className="group">
              <Card className="h-full transition-all border-border/50 hover:border-primary hover:shadow-md">
                <CardHeader className="pb-2">
                  <Headphones className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Technical Support</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600">
                    Real-time assistance and troubleshooting
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <span className="text-primary text-sm font-medium group-hover:underline">Learn more</span>
                </CardFooter>
              </Card>
            </Link>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Administrative Procedures?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of companies already benefiting from our digital transformation solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
              <Link to="/company-registration">Register Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white hover:bg-white/20" asChild>
              <Link to="/support">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
