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
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/faq" element={<FAQ />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
