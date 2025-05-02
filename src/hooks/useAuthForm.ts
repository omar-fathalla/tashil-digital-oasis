
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

export const useAuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Anonymous login handler
  const handleAnonymousLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) throw error;
      
      toast({
        title: "Login Successful",
        description: "Welcome to Tashil Platform",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Anonymous login error:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Logout Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Logout Successful",
        description: "You have been logged out",
      });

      setError(null);
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  return {
    isLoading,
    error,
    handleAnonymousLogin,
    handleSignOut,
    user
  };
};
