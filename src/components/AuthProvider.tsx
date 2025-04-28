
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isEmailVerified: boolean;
  resendVerificationEmail: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  session: null,
  isLoading: true,
  isEmailVerified: false,
  resendVerificationEmail: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    // Check for active session on initial load
    const initializeAuth = async () => {
      try {
        // Set up auth state listener first (important for catching events during init)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              setSession(currentSession);
              setUser(currentSession?.user || null);
              
              // Update email verification status when auth state changes
              if (currentSession?.user) {
                setIsEmailVerified(currentSession.user.email_confirmed_at !== null);
              } else {
                setIsEmailVerified(false);
              }
            }
            
            if (event === 'SIGNED_OUT') {
              setSession(null);
              setUser(null);
              setIsEmailVerified(false);
            }
            
            setIsLoading(false);
          }
        );

        // Then check for existing session
        const { data: { session: activeSession } } = await supabase.auth.getSession();
        
        if (activeSession) {
          setSession(activeSession);
          setUser(activeSession.user);
          
          // Check if email is verified
          if (activeSession.user) {
            setIsEmailVerified(activeSession.user.email_confirmed_at !== null);
          }
        }
        
        setIsLoading(false);
        
        // Clean up subscription on unmount
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Function to resend verification email
  const resendVerificationEmail = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      
      if (error) throw error;
    } catch (error) {
      console.error("Error resending verification email:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      isEmailVerified,
      resendVerificationEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
