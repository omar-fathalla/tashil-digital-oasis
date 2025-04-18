
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
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
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
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
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
