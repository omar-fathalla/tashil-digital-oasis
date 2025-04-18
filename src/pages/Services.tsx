
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  UserPlus, 
  FileText, 
  Database, 
  BarChart, 
  Headphones, 
  ChevronRight, 
  CheckCircle 
} from "lucide-react";

const ServicesPage = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-primary-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Services</h1>
            <p className="text-lg text-gray-600 mb-8">
              Comprehensive digital solutions to streamline your administrative procedures
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 - Employee Registration */}
            <Card className="border border-border/40 hover:border-primary/60 transition-all hover:shadow-md">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center mb-4">
                  <UserPlus className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Employee Registration Service</CardTitle>
                <CardDescription>Streamline your employee onboarding process</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Digital employee profiles with secure access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Automated verification of employee documents</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Fast-track registration for bulk submissions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Compliance with labor regulations</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to="/company-registration">
                    Register Now
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Service 2 - Document Management */}
            <Card className="border border-border/40 hover:border-primary/60 transition-all hover:shadow-md">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Document Management Service</CardTitle>
                <CardDescription>Securely store, organize, and retrieve documents</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Secure cloud storage with advanced encryption</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Role-based access control for sensitive documents</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Automated document version control</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Advanced search and retrieval capabilities</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to="/request-submission">
                    Learn More
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Service 3 - Digital ID Issuance */}
            <Card className="border border-border/40 hover:border-primary/60 transition-all hover:shadow-md">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Digital ID Issuance</CardTitle>
                <CardDescription>Secure digital identification for all employees</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Tamper-proof digital ID cards with QR verification</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Mobile-compatible ID for contactless authentication</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Automatic expiry and renewal notifications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Integration with access control systems</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to="/request-submission">
                    Apply Now
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Service 4 - Reporting and Archiving */}
            <Card className="border border-border/40 hover:border-primary/60 transition-all hover:shadow-md">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Reporting and Archiving Tools</CardTitle>
                <CardDescription>Gain insights from your administrative data</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Customizable dashboard with key metrics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Scheduled reports delivered to stakeholders</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Compliance and audit trail reports</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Secure long-term archiving with retrieval options</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to="/company-registration">
                    Explore Reports
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Service 5 - Technical Support */}
            <Card className="border border-border/40 hover:border-primary/60 transition-all hover:shadow-md">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center mb-4">
                  <Headphones className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Real-time Technical Support</CardTitle>
                <CardDescription>Get help whenever you need it</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">24/7 support via chat, email, and phone</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Remote troubleshooting capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Knowledge base with step-by-step guides</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Regular training webinars for new features</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to="/support">
                    Contact Support
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Experience Our Services?</h2>
            <p className="text-lg mb-8 opacity-90">
              Start your digital transformation journey with Tashil Platform today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/company-registration">Register Company</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white hover:bg-white/20" asChild>
                <Link to="/request-submission">Submit Request</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
