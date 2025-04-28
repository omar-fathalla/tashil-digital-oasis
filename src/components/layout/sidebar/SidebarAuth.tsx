
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SidebarAuth() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (user) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2 py-1 text-sm text-sidebar-foreground">
          <span className="truncate font-medium">{user.email}</span>
        </div>
        <ThemeToggle className="mb-2" />
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full transition-all duration-200 hover:scale-[1.02]" 
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 mr-2" /> Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <ThemeToggle className="mb-2" />
      <Button variant="outline" size="sm" className="w-full transition-all duration-200 hover:scale-[1.02]" asChild>
        <Link to="/auth">Sign In</Link>
      </Button>
      <Button variant="default" size="sm" className="w-full transition-all duration-200 hover:scale-[1.02]" asChild>
        <Link to="/auth">Register</Link>
      </Button>
    </div>
  );
}
