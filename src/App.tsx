
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import NotFound from "@/pages/NotFound";
import RootLayout from "@/components/layout/RootLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
      
      {/* Auth routes outside of main layout */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
