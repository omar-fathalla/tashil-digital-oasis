
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import StatusHero from "@/components/application-status/StatusHero";
import SearchAndFilter from "@/components/application-status/SearchAndFilter";
import NotificationsCard from "@/components/application-status/NotificationsCard";

const ApplicationStatus = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <StatusHero />
      
      <section className="py-12 bg-white flex-1">
        <div className="container mx-auto px-4">
          <SearchAndFilter 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          
          <div className="mt-8">
            <NotificationsCard />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApplicationStatus;
