
import { useEffect } from "react";
import { useNavigate, useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Spinner } from "@/components/ui/spinner";

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth", { state: { from: location }, replace: true });
    }
  }, [user, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/auth" state={{ from: location }} replace />;
};
