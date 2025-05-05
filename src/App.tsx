
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./components/layout/RootLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import CompanyRegistration from "./pages/CompanyRegistration";
import RequestSubmission from "./pages/RequestSubmission";
import ApplicationStatus from "./pages/ApplicationStatus";
import Report from "./pages/Report";
import ProjectOverview from "./pages/ProjectOverview";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import PrintBatch from "./pages/PrintBatch";
import EmployeeManagement from "./pages/EmployeeManagement";
import EmployeeProfile from "./pages/EmployeeProfile";
import DocumentManagement from "./pages/DocumentManagement";
import DocumentAnalytics from "./pages/DocumentAnalytics";
import Accounting from "./pages/Accounting";
import CompanyManagement from "./pages/CompanyManagement";
import { useEffect } from "react";
import { ensureDemoData } from "@/utils/seedDemoData";

const queryClient = new QueryClient();

const App = () => {
  // Ensure we have demo data when the app starts
  useEffect(() => {
    ensureDemoData().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/company-registration" element={<CompanyRegistration />} />
              <Route path="/request-submission" element={<RequestSubmission />} />
              <Route path="/application-status" element={<ApplicationStatus />} />
              <Route path="/report" element={<Report />} />
              <Route path="/project-overview" element={<ProjectOverview />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/print-batch" element={<PrintBatch />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/employee-management" element={<EmployeeManagement />} />
              <Route path="/employee-profile/:employeeId" element={<EmployeeProfile />} />
              <Route path="/document-management" element={<DocumentManagement />} />
              <Route path="/document-analytics" element={<DocumentAnalytics />} />
              <Route path="/accounting" element={<Accounting />} />
              <Route path="/company-management" element={<CompanyManagement />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
