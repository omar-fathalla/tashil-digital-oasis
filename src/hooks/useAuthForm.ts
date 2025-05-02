
import { useState, useEffect } from "react";
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

  // Check if anonymous sign-in is available on component mount
  useEffect(() => {
    // An async function to test if anonymous auth is enabled
    const checkAnonymousAuth = async () => {
      try {
        // We'll make a test call and catch the error
        const { data, error } = await supabase.auth.signInAnonymously();
        
        if (error) {
          if (error.message.includes("disabled")) {
            setError("Anonymous sign-ins are disabled");
          } else {
            setError(error.message);
          }
        }
        
        // If there was no error but we somehow got a session, sign out
        if (data.session) {
          await supabase.auth.signOut();
        }
      } catch (err: any) {
        console.error("Error checking anonymous auth:", err);
        setError("Error checking authentication status");
      }
    };

    // Only run this check if anonymous login is the primary auth method
    checkAnonymousAuth();
  }, []);

  // Anonymous login handler
  const handleAnonymousLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        if (error.message.includes("disabled")) {
          throw new Error("Anonymous sign-ins are disabled");
        } else {
          throw error;
        }
      }
      
      toast({
        title: "Login Successful",
        description: "Welcome to Tashil Platform",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Anonymous login error:", error);
      setError(error.message);
      toast({
        title: "Authentication Error",
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
