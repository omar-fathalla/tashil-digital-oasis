
import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

export const NavLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="rounded-full bg-primary p-1">
        <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold text-primary">ID</span>
      <span className="text-xl font-semibold text-foreground">Tashil</span>
    </Link>
  );
};
