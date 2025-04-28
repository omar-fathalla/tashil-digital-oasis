
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

  // Fetch roles
  const fetchRoles = async () => {
    const { data, error } = await supabase.from("roles").select("*");
    
    if (error) {
      console.error("Error fetching roles:", error);
      setError("Failed to fetch user roles");
      return [];
    }
    
    return data || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + '/auth',
          }
        });

        if (error) throw error;
        
        toast({
          title: "Account Created Successfully",
          description: "Please check your email for verification link",
        });
        
        // Redirect to verification notice page
        navigate("/auth", { state: { justRegistered: true } });
      } else {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Check if user exists and set admin role for the specified email
        if (user && user.email === "fathalla80800@gmail.com") {
          // First, check if a role with the name 'admin' exists
          const { data: roleData, error: roleError } = await supabase
            .from('roles')
            .select('id')
            .eq('name', 'admin')
            .single();
            
          if (roleError && roleError.code !== 'PGRST116') {
            console.error("Error fetching admin role:", roleError);
          }
          
          let roleId = roleData?.id;
          
          // If the role doesn't exist, create it
          if (!roleId) {
            const { data: newRole, error: createError } = await supabase
              .from('roles')
              .insert({ name: 'admin', description: 'Administrator role' })
              .select('id')
              .single();
              
            if (createError) {
              console.error("Error creating admin role:", createError);
            } else {
              roleId = newRole.id;
            }
          }
          
          // If we have a role ID, update the user's role
          if (roleId) {
            const { error: updateError } = await supabase
              .from('users')
              .update({ role: 'admin', role_id: roleId })
              .eq('id', user.id);
              
            if (updateError) console.error("Error setting admin role:", updateError);
          }
        }
        
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
