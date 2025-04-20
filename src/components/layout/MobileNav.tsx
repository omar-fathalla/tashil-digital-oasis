
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  Menu,
  X,
  HomeIcon,
  CalendarIcon,
  FileTextIcon,
  InfoIcon,
  LayoutIcon,
  PrinterIcon,
  FileIcon,
  SettingsIcon,
  UsersIcon
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function MobileNav() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        className="md:hidden fixed top-5 right-4 z-40 p-2 text-gray-500 hover:text-gray-800"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={closeMenu}
        />
      )}

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-64 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-lg`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-10">
            <img
              src="/placeholder.svg"
              alt="Logo"
              className="h-8 w-auto"
            />
          </div>

          <ul className="space-y-1">
            <MobileNavItem to="/" icon={<HomeIcon className="h-4 w-4" />} onClick={closeMenu}>
              Dashboard
            </MobileNavItem>
            
            <MobileNavItem to="/request-submission" icon={<FileIcon className="h-4 w-4" />} onClick={closeMenu}>
              Submit Request
            </MobileNavItem>
            
            <MobileNavItem to="/application-status" icon={<FileTextIcon className="h-4 w-4" />} onClick={closeMenu}>
              Application Status
            </MobileNavItem>
            
            <MobileNavItem to="/company-registration" icon={<LayoutIcon className="h-4 w-4" />} onClick={closeMenu}>
              Company Registration
            </MobileNavItem>
            
            <MobileNavItem to="/employee-management" icon={<UsersIcon className="h-4 w-4" />} onClick={closeMenu}>
              Employee Management
            </MobileNavItem>
            
            <MobileNavItem to="/print-batch" icon={<PrinterIcon className="h-4 w-4" />} onClick={closeMenu}>
              Print Center
            </MobileNavItem>
            
            <MobileNavItem to="/report" icon={<CalendarIcon className="h-4 w-4" />} onClick={closeMenu}>
              Reports
            </MobileNavItem>
            
            <MobileNavItem to="/project-overview" icon={<InfoIcon className="h-4 w-4" />} onClick={closeMenu}>
              About
            </MobileNavItem>
            
            {user && (
              <MobileNavItem to="/settings" icon={<SettingsIcon className="h-4 w-4" />} onClick={closeMenu}>
                Settings
              </MobileNavItem>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

interface MobileNavItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}

function MobileNavItem({ to, icon, children, onClick }: MobileNavItemProps) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
            isActive
              ? "bg-primary/10 text-primary font-medium"
              : "text-gray-600 hover:bg-gray-100"
          }`
        }
        onClick={onClick}
      >
        {icon}
        {children}
      </NavLink>
    </li>
  );
}
