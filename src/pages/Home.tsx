
import { useState, useCallback, useMemo } from "react";
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
  
  // Use useMemo for filter options to prevent recreating the object on every render
  const filterOptions = useMemo(() => ({ 
    status: activeFilter !== "all" ? activeFilter : undefined, 
    searchQuery, 
    dateRange, 
    area: selectedArea !== "all" ? selectedArea : undefined,
    company: selectedCompany !== "all" ? selectedCompany : undefined
  }), [activeFilter, searchQuery, dateRange, selectedArea, selectedCompany]);

  const { 
    registrationRequests, 
    isLoading, 
    error, 
    approveRequest, 
    rejectRequest 
  } = useRegistrationRequests(filterOptions);

  // Use useCallback to prevent recreation of these functions on every render
  const handleViewRequest = useCallback((request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  }, []);

  const handleApproveRequest = useCallback(async (requestId, notes) => {
    await approveRequest(requestId, notes);
    setOpenDialog(false);
  }, [approveRequest]);

  const handleRejectRequest = useCallback(async (requestId, reason) => {
    await rejectRequest(requestId, reason);
    setOpenDialog(false);
  }, [rejectRequest]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  // Memoize the filter state updater callbacks
  const handleSetSearchQuery = useCallback((value) => {
    setSearchQuery(value);
  }, []);

  const handleSetActiveFilter = useCallback((value) => {
    setActiveFilter(value);
  }, []);

  const handleSetDateRange = useCallback((value) => {
    setDateRange(value);
  }, []);

  const handleSetSelectedArea = useCallback((value) => {
    setSelectedArea(value);
  }, []);

  const handleSetSelectedCompany = useCallback((value) => {
    setSelectedCompany(value);
  }, []);

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
        setSearchQuery={handleSetSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={handleSetActiveFilter}
        dateRange={dateRange}
        setDateRange={handleSetDateRange}
        selectedArea={selectedArea}
        setSelectedArea={handleSetSelectedArea}
        selectedCompany={selectedCompany}
        setSelectedCompany={handleSetSelectedCompany}
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
          onClose={handleCloseDialog}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
        />
      )}
    </div>
  );
};

export default Dashboard;
