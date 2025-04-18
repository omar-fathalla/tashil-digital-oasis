
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

export const useAuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("fathalla80800@gmail.com");
  const [password, setPassword] = useState("Omar3005");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: "Account Created Successfully",
          description: "Please check your email for activation",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: "Login Successful",
          description: "Welcome to Tashil Platform",
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
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
        description: "You have been logged out of your account",
      });

      setEmail("");
      setPassword("");
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
    isSignUp,
    email,
    password,
    error,
    setIsSignUp,
    setEmail,
    setPassword,
    handleSubmit,
    handleSignOut,
    user
  };
};
