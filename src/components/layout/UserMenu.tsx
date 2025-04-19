
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface UserMenuProps {
  userEmail?: string | null;
  onSignOut: () => Promise<void>;
}

export const UserMenu = ({ userEmail, onSignOut }: UserMenuProps) => {
  return (
    <div className="hidden md:flex items-center gap-2">
      {userEmail ? (
        <>
          <span className="text-sm text-gray-600">
            {userEmail}
          </span>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onSignOut}
            className="hidden md:flex"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Button size="sm" variant="outline" asChild className="hidden md:flex">
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button size="sm" asChild className="hidden md:flex">
            <Link to="/auth">Register</Link>
          </Button>
        </>
      )}
    </div>
  );
};
