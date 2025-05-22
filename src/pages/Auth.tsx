
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, isEmailVerified } = useAuth();
  
  useEffect(() => {
    if (user && isEmailVerified && !isLoading) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } else if (!isLoading) {
      // Redirect to the new login page
      navigate("/login", { state: { from: location.state?.from } });
    }
  }, [user, isLoading, isEmailVerified, navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
    </div>
  );
};

export default Auth;
