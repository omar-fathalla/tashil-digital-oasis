
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  mobileMenuOpen: boolean;
  onSignOut: () => void;
}

export const MobileNav = ({ mobileMenuOpen, onSignOut }: MobileNavProps) => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/application-status", label: "Application Status" },
    { href: "/project-overview", label: "Projects" },
    { href: "/employee-management", label: "Employee Management" },
    { href: "/document-management", label: "Document Management" },
    { href: "/document-analytics", label: "Analytics" },
    { href: "/faq", label: "FAQ" },
    { href: "/settings", label: "Settings" },
  ];

  const isActive = (path: string) => pathname === path;

  if (!mobileMenuOpen) return null;

  // Only show auth links if user is not logged in and we're on the about page
  if (!user && pathname === "/about") {
    return (
      <div className="md:hidden bg-background py-4 border-b">
        <div className="container space-y-4">
          <Button variant="outline" asChild className="w-full justify-center">
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button asChild className="w-full justify-center">
            <Link to="/register">Register Company</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Show full navigation for authenticated users
  if (user) {
    return (
      <div className="md:hidden bg-background py-4 border-b">
        <div className="container space-y-1">
          {links.map((link) => (
            <Link 
              key={link.href}
              to={link.href}
              className={cn(
                "block py-2 text-base font-medium transition-colors hover:text-primary",
                isActive(link.href)
                  ? "text-black dark:text-white"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={onSignOut}
            className="block w-full text-left py-2 text-base font-medium text-red-500 hover:text-red-700 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return null;
};
