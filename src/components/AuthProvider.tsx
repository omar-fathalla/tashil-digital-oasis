
import { createContext, useContext } from "react";

type AuthContextType = {
  user: { 
    id: string; 
    email?: string;
    role?: string;
  } | null;
  session: { 
    user: { 
      id: string;
      email?: string;
      role?: string;
    } 
  } | null;
  isLoading: boolean;
  isEmailVerified: boolean;
  resendVerificationEmail: () => Promise<void>;
};

// Create a mock authenticated user and session with all required properties
const mockUser = { 
  id: "public-access",
  email: "guest@example.com",
  role: "admin" // Give the mock user admin role for full access
};
const mockSession = { user: mockUser };

const AuthContext = createContext<AuthContextType>({ 
  user: mockUser,
  session: mockSession,
  isLoading: false,
  isEmailVerified: true,
  resendVerificationEmail: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={{ 
      user: mockUser,
      session: mockSession,
      isLoading: false,
      isEmailVerified: true,
      resendVerificationEmail: async () => {}
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
