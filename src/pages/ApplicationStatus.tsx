
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  FileCheck, 
  FileMinus, 
  FileX, 
  Eye, 
  Download, 
  Upload, 
  Bell 
} from "lucide-react";

// Mock data for applications
const MOCK_APPLICATIONS = [
  {
    id: "REQ-2025-04873",
    employeeName: "Ahmed Al-Farsi",
    employeeId: "SA12345678",
    type: "New Employee Registration",
    requestDate: "2025-04-15",
    status: "approved",
    notes: "Digital ID ready for download",
  },
  {
    id: "REQ-2025-04872",
    employeeName: "Mohammed Hassan",
    employeeId: "SA98765432",
    type: "ID Renewal",
    requestDate: "2025-04-15",
    status: "under-review",
    notes: "Documents under verification",
  },
  {
    id: "REQ-2025-04871",
    employeeName: "Sara Al-Qahtani",
    employeeId: "SA45678912",
    type: "Information Update",
    requestDate: "2025-04-14",
    status: "rejected",
    notes: "Authorization document unclear, please re-upload",
  },
  {
    id: "REQ-2025-04870",
    employeeName: "Fatima Abdullah",
    employeeId: "SA78912345",
    type: "New Employee Registration",
    requestDate: "2025-04-14",
    status: "approved",
    notes: "Digital ID ready for download",
  },
  {
    id: "REQ-2025-04869",
    employeeName: "Khalid Al-Shehri",
    employeeId: "SA65432198",
    type: "Employment Termination",
    requestDate: "2025-04-13",
    status: "under-review",
    notes: "Pending final approval",
  },
];

// Status badge variants
const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
    case "rejected":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rejected</Badge>;
    case "under-review":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Under Review</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <FileCheck className="h-5 w-5 text-green-600" />;
    case "rejected":
      return <FileX className="h-5 w-5 text-red-600" />;
    case "under-review":
      return <FileMinus className="h-5 w-5 text-yellow-600" />;
    default:
      return null;
  }
};

const ApplicationStatus = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredApplications, setFilteredApplications] = useState(MOCK_APPLICATIONS);
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query) {
      handleFilter(activeFilter);
      return;
    }
    
    const filtered = MOCK_APPLICATIONS.filter(app => 
      app.id.toLowerCase().includes(query.toLowerCase()) ||
      app.employeeName.toLowerCase().includes(query.toLowerCase()) ||
      app.employeeId.toLowerCase().includes(query.toLowerCase()) ||
      app.type.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredApplications(filtered);
  };
  
  // Handle filter
  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
    
    if (filter === "all") {
      setFilteredApplications(
        searchQuery ? 
          MOCK_APPLICATIONS.filter(app => 
            app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.type.toLowerCase().includes(searchQuery.toLowerCase())
          ) : 
          MOCK_APPLICATIONS
      );
      return;
    }
    
    const filtered = MOCK_APPLICATIONS.filter(app => app.status === filter);
    
    if (searchQuery) {
      return setFilteredApplications(filtered.filter(app => 
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.type.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    }
    
    setFilteredApplications(filtered);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-primary-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Application Status</h1>
            <p className="text-lg text-gray-600">
              Track and manage your submitted requests.
            </p>
          </div>
        </div>
      </section>

      {/* Status Page */}
      <section className="py-12 bg-white flex-1">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by request ID, name or employee ID"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant={activeFilter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleFilter("all")}
                className={activeFilter === "all" ? "" : "text-gray-500"}
              >
                All
              </Button>
              <Button 
                variant={activeFilter === "under-review" ? "default" : "outline"}
                size="sm" 
                onClick={() => handleFilter("under-review")}
                className={activeFilter === "under-review" ? "" : "text-yellow-600"}
              >
                <FileMinus className="h-4 w-4 mr-1" />
                Under Review
              </Button>
              <Button 
                variant={activeFilter === "approved" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleFilter("approved")}
                className={activeFilter === "approved" ? "" : "text-green-600"}
              >
                <FileCheck className="h-4 w-4 mr-1" />
                Approved
              </Button>
              <Button 
                variant={activeFilter === "rejected" ? "default" : "outline"} 
                size="sm"
                onClick={() => handleFilter("rejected")}
                className={activeFilter === "rejected" ? "" : "text-red-600"}
              >
                <FileX className="h-4 w-4 mr-1" />
                Rejected
              </Button>
            </div>
          </div>
          
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-0">
              <CardTitle>Request Applications</CardTitle>
              <CardDescription>
                Showing {filteredApplications.length} of {MOCK_APPLICATIONS.length} total requests
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Status</TableHead>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.length > 0 ? (
                      filteredApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell>
                            {getStatusIcon(application.status)}
                          </TableCell>
                          <TableCell className="font-medium">{application.id}</TableCell>
                          <TableCell>{application.employeeName}</TableCell>
                          <TableCell>{application.employeeId}</TableCell>
                          <TableCell>{application.type}</TableCell>
                          <TableCell>{application.requestDate}</TableCell>
                          <TableCell>{application.notes}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {application.status === "approved" && (
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                              {application.status === "rejected" && (
                                <Button variant="ghost" size="icon">
                                  <Upload className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          No applications found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between py-4">
              <div className="text-sm text-gray-500">
                Showing page 1 of 1
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <div className="mt-8">
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-primary mr-2" />
                  <CardTitle className="text-lg">Notifications</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 pb-4 border-b">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Bell className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Request Status Update</p>
                      <p className="text-sm text-gray-600">Request REQ-2025-04873 has been approved. You can now download the digital ID.</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 pb-4 border-b">
                    <div className="bg-red-100 p-2 rounded-full">
                      <FileX className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Request Rejected</p>
                      <p className="text-sm text-gray-600">Request REQ-2025-04871 was rejected. Please check the notes and re-upload the required documents.</p>
                      <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <FileMinus className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">Request Under Review</p>
                      <p className="text-sm text-gray-600">Request REQ-2025-04872 is currently under review. You will be notified once the status changes.</p>
                      <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApplicationStatus;
