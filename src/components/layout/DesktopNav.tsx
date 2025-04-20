
import { NavLink } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { 
  CalendarIcon, 
  FileTextIcon, 
  HomeIcon, 
  InfoIcon, 
  LayoutIcon, 
  PrinterIcon, 
  FileIcon, 
  SettingsIcon,
  UsersIcon
} from "lucide-react";

export default function DesktopNav() {
  const { user } = useAuth();

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-gray-200 hidden md:block">
      <div className="p-6">
        <div className="mb-10">
          <img 
            src="/placeholder.svg" 
            alt="Logo" 
            className="h-10 w-auto mb-6" 
          />
          <div className="text-sm text-gray-500">
            <span>Tashil Platform</span>
          </div>
        </div>
        
        <ul className="space-y-1">
          <NavItem to="/" icon={<HomeIcon className="h-4 w-4" />}>
            Dashboard
          </NavItem>

          <NavItem to="/request-submission" icon={<FileIcon className="h-4 w-4" />}>
            Submit Request
          </NavItem>
          
          <NavItem to="/application-status" icon={<FileTextIcon className="h-4 w-4" />}>
            Application Status
          </NavItem>

          <NavItem to="/company-registration" icon={<LayoutIcon className="h-4 w-4" />}>
            Company Registration
          </NavItem>
          
          <NavItem to="/employee-management" icon={<UsersIcon className="h-4 w-4" />}>
            Employee Management
          </NavItem>
          
          <NavItem to="/print-batch" icon={<PrinterIcon className="h-4 w-4" />}>
            Print Center
          </NavItem>
          
          <NavItem to="/report" icon={<CalendarIcon className="h-4 w-4" />}>
            Reports
          </NavItem>
          
          <NavItem to="/project-overview" icon={<InfoIcon className="h-4 w-4" />}>
            About
          </NavItem>
          
          {user && (
            <NavItem to="/settings" icon={<SettingsIcon className="h-4 w-4" />}>
              Settings
            </NavItem>
          )}
        </ul>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-6 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>Tashil Platform &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </nav>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function NavItem({ to, icon, children }: NavItemProps) {
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
      >
        {icon}
        {children}
      </NavLink>
    </li>
  );
}
