
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, Settings, Smartphone, Radio } from "lucide-react";

const About = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-primary-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About Tashil Platform</h1>
            <p className="text-lg text-gray-600 mb-8">
              Leading the way in digital transformation for administrative procedures, 
              making government and business interactions faster, more secure, and more efficient.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Who We Are</h2>
              <p className="text-gray-600 mb-4">
                Tashil Platform was established with a clear vision: to eliminate bureaucratic inefficiencies 
                and transform administrative procedures through innovative digital solutions.
              </p>
              <p className="text-gray-600 mb-4">
                We are a team of technology experts, government procedure specialists, and user experience 
                designers working together to create intuitive systems that save time, reduce errors, 
                and enhance security for both organizations and individuals.
              </p>
              <p className="text-gray-600">
                Our approach combines cutting-edge technology with deep understanding of administrative 
                workflows to deliver solutions that truly make a difference in operational efficiency.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 rounded-lg rotate-3 scale-105 opacity-20"></div>
              <img
                src="/placeholder.svg" 
                alt="Tashil Team"
                className="relative z-10 rounded-lg shadow-xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Goals */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-primary mb-4">Our Mission and Goals</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We are committed to transforming administrative procedures through digital innovation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-primary">Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To create an administrative ecosystem where every process is digital, 
                  efficient, transparent, and accessible to all stakeholders.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-primary">Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To develop and implement innovative digital solutions that streamline administrative 
                  procedures, reduce bureaucracy, and enhance service delivery.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-primary">Values</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Innovation through technology</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Respect for user privacy and data security</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Commitment to excellence in service delivery</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Traditional vs Digital System */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-primary mb-4">Traditional System vs Digital System</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See the transformative impact of our digital solutions compared to traditional approaches.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary-700 text-white">
                  <th className="px-6 py-4 text-left">Aspect</th>
                  <th className="px-6 py-4 text-left">Traditional System</th>
                  <th className="px-6 py-4 text-left">Tashil Digital System</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Processing Time</td>
                  <td className="px-6 py-4">Weeks to months</td>
                  <td className="px-6 py-4 text-primary-700 font-medium">Minutes to hours</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Document Storage</td>
                  <td className="px-6 py-4">Physical files, prone to damage</td>
                  <td className="px-6 py-4 text-primary-700 font-medium">Secure digital storage with backups</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Error Rate</td>
                  <td className="px-6 py-4">High due to manual processing</td>
                  <td className="px-6 py-4 text-primary-700 font-medium">Minimal with automated validation</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Accessibility</td>
                  <td className="px-6 py-4">Limited to office hours and locations</td>
                  <td className="px-6 py-4 text-primary-700 font-medium">24/7 access from anywhere</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Tracking &amp; Reporting</td>
                  <td className="px-6 py-4">Manual, time-consuming</td>
                  <td className="px-6 py-4 text-primary-700 font-medium">Real-time automated reports</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Environmental Impact</td>
                  <td className="px-6 py-4">High paper consumption</td>
                  <td className="px-6 py-4 text-primary-700 font-medium">Paperless, eco-friendly</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Digital Transformation Journey */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-primary mb-4">Stages of Digital Transformation Journey</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The evolution from paper-based processes to intelligent administrative systems.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary-300 transform -translate-x-1/2"></div>
            
            <div className="space-y-12">
              {/* Stage 1 */}
              <div className="relative">
                <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                  <div className="md:text-right pb-8 md:pb-0">
                    <div className="bg-white p-6 rounded-lg shadow-md inline-block">
                      <div className="flex flex-col md:items-end">
                        <FileText className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Paper-based</h3>
                        <p className="text-gray-600">
                          Traditional administrative systems rely heavily on paper forms, 
                          manual verification, and physical storage of documents.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="md:hidden h-14 w-0.5 bg-primary-300 mx-auto"></div>
                  <div className="hidden md:block">
                    <div className="h-8 w-8 rounded-full bg-primary border-4 border-white shadow absolute left-1/2 top-1/4 transform -translate-x-1/2"></div>
                  </div>
                </div>
              </div>
              
              {/* Stage 2 */}
              <div className="relative">
                <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                  <div className="hidden md:block"></div>
                  <div className="md:hidden h-14 w-0.5 bg-primary-300 mx-auto"></div>
                  <div className="pb-8 md:pb-0">
                    <div className="bg-white p-6 rounded-lg shadow-md inline-block">
                      <div className="flex flex-col">
                        <Settings className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Semi-digital</h3>
                        <p className="text-gray-600">
                          Basic computerization of some processes, but still requiring 
                          physical documents and manual interventions at key stages.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="h-8 w-8 rounded-full bg-primary border-4 border-white shadow absolute left-1/2 top-1/4 transform -translate-x-1/2"></div>
                  </div>
                </div>
              </div>
              
              {/* Stage 3 */}
              <div className="relative">
                <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                  <div className="md:text-right pb-8 md:pb-0">
                    <div className="bg-white p-6 rounded-lg shadow-md inline-block">
                      <div className="flex flex-col md:items-end">
                        <Smartphone className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">Digital</h3>
                        <p className="text-gray-600">
                          End-to-end digital processes with electronic forms, digital 
                          signatures, and automated workflows reducing manual handling.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="md:hidden h-14 w-0.5 bg-primary-300 mx-auto"></div>
                  <div className="hidden md:block">
                    <div className="h-8 w-8 rounded-full bg-primary border-4 border-white shadow absolute left-1/2 top-1/4 transform -translate-x-1/2"></div>
                  </div>
                </div>
              </div>
              
              {/* Stage 4 */}
              <div className="relative">
                <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                  <div className="hidden md:block"></div>
                  <div className="md:hidden h-14 w-0.5 bg-primary-300 mx-auto"></div>
                  <div>
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 rounded-lg shadow-md inline-block text-white">
                      <div className="flex flex-col">
                        <Radio className="h-10 w-10 text-white mb-4" />
                        <h3 className="text-xl font-bold mb-2">Smart</h3>
                        <p className="opacity-90">
                          AI-powered systems with predictive capabilities, automated decision-making,
                          and continuous process optimization based on data analytics.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="h-8 w-8 rounded-full bg-primary border-4 border-white shadow absolute left-1/2 top-1/4 transform -translate-x-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
