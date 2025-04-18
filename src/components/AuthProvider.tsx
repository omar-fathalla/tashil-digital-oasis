
import { createContext, useContext, useState } from "react";

type User = {
  id: string;
  email: string;
};

type Session = {
  user: User;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
};

const AuthContext = createContext<AuthContextType>({ user: null, session: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // For demo purposes, we'll create a mock user
  const mockUser = {
    id: "mock-user-id",
    email: "demo@example.com",
  };

  const mockSession = {
    user: mockUser,
  };

  const [user] = useState<User | null>(mockUser);
  const [session] = useState<Session | null>(mockSession);

  return (
    <AuthContext.Provider value={{ user, session }}>
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
