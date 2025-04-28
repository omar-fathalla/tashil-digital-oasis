
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";

export const DesktopNav = () => {
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
  ];

  const isActive = (path: string) => pathname === path;

  // Only show auth links if user is not logged in and we're on the about page
  if (!user && pathname === "/about") {
    return (
      <div className="hidden md:flex md:gap-x-4">
        <Button variant="outline" asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
        <Button asChild>
          <Link to="/register">Register Company</Link>
        </Button>
      </div>
    );
  }

  // Show navigation links only for authenticated users
  if (user) {
    return (
      <div className="hidden md:flex md:gap-x-6 ml-6">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive(link.href)
                ? "text-black dark:text-white"
                : "text-muted-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    );
  }

  return null;
};
