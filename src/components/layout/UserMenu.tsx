
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  userEmail?: string | null;
  onSignOut: () => Promise<void>;
}

export const UserMenu = ({ userEmail, onSignOut }: UserMenuProps) => {
  if (!userEmail) {
    return (
      <div className="hidden md:flex items-center gap-2">
        <Button size="sm" variant="outline" asChild className="hidden md:flex">
          <Link to="/auth">Sign In</Link>
        </Button>
        <Button size="sm" asChild className="hidden md:flex">
          <Link to="/auth">Register</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="hidden md:flex"
        >
          <User className="h-4 w-4 mr-2" />
          {userEmail}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link to="/settings" className="w-full">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
