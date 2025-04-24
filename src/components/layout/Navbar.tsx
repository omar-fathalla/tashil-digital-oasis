
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { NavLogo } from "./NavLogo";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <NavLogo />
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {user && (
            <>
              <span className="text-sm font-medium mr-2">
                {user.email}
              </span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleSignOut}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
