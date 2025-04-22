
import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

export const NavLogo = () => {
  return (
    <div className="flex items-center gap-2 mr-4">
      <Link to="/" className="flex items-center gap-2">
        <div className="rounded-full bg-primary p-1">
          <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-semibold text-foreground hidden sm:block">ID</span>
      </Link>
    </div>
  );
};
