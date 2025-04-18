
import { useState } from "react";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AlertsCard } from "@/components/dashboard/AlertsCard";
import { SettingsCard } from "@/components/dashboard/SettingsCard";
import { RegistrationRequestsTable } from "@/components/dashboard/RegistrationRequestsTable";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { RequestDetailsDialog } from "@/components/dashboard/RequestDetailsDialog";
import { useRegistrationRequests } from "@/hooks/useRegistrationRequests";

const Dashboard = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  
  const { 
    registrationRequests, 
    isLoading, 
    error, 
    approveRequest, 
    rejectRequest 
  } = useRegistrationRequests({ 
    status: activeFilter !== "all" ? activeFilter : undefined, 
    searchQuery, 
    dateRange, 
    area: selectedArea !== "all" ? selectedArea : undefined,
    company: selectedCompany !== "all" ? selectedCompany : undefined
  });

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  const handleApproveRequest = async (requestId, notes) => {
    await approveRequest(requestId, notes);
    setOpenDialog(false);
  };

  const handleRejectRequest = async (requestId, reason) => {
    await rejectRequest(requestId, reason);
    setOpenDialog(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCards />
        <QuickActions />
        <AlertsCard />
        <SettingsCard />
      </div>
      
      <DashboardFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
      />
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Registration Requests</h2>
        <RegistrationRequestsTable
          requests={registrationRequests}
          isLoading={isLoading}
          error={error}
          onViewRequest={handleViewRequest}
        />
      </div>
      
      {selectedRequest && (
        <RequestDetailsDialog
          request={selectedRequest}
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
        />
      )}
    </div>
  );
};

export default Dashboard;
