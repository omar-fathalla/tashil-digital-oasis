
import { createContext, useContext } from "react";

type AuthContextType = {
  user: { id: string } | null;
  session: { user: { id: string } } | null;
  isLoading: boolean;
  isEmailVerified: boolean;
  resendVerificationEmail: () => Promise<void>;
};

// Create a mock authenticated user and session
const mockUser = { id: "public-access" };
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
