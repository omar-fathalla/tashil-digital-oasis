
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";

export const DesktopNav = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/company-registration", label: "Company Registration" },
    { href: "/request-submission", label: "Request Submission" },
    { href: "/application-status", label: "Application Status" },
    { href: "/project-overview", label: "Project Overview" },
    { href: "/employee-management", label: "Employee Management" },
    { href: "/faq", label: "FAQ" },
  ];

  const isActive = (path: string) => pathname === path;

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
};
