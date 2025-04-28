
import { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, isEmailVerified } = useAuth();
  
  useEffect(() => {
    if (user && isEmailVerified && !isLoading) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm />
      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          New to our platform?{" "}
          <Link to="/register">
            <Button variant="link" className="p-0 h-auto">
              Register your company
            </Button>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Auth;
