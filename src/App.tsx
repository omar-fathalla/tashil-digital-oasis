import { useState, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeProvider } from "@/components/theme-provider";
import {
  Home,
  RequestSubmission,
  EmployeeManagement,
  EmployeeProfile,
  RequestsManagement,
  CompanyManagement,
  RegistrationRequests,
} from "@/pages";
import { RootLayout } from "@/layouts";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Account } from "@/pages/Account";
import {
  EventCalendar,
  Notifications,
  UserSettings,
  Dashboard,
  ApplicationStatus,
} from "@/pages/app";
import { RegistrationRequestsTable } from "@/components/registration-requests/RegistrationRequestsTable";

const App = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const supabaseClient = useSupabaseClient();
  const session = useSession();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Do not render anything until the app is hydrated
  if (!isHydrated) {
    return null;
  }

  const router = createBrowserRouter([
    {
      path: "/auth",
      element: (
        <div className="grid h-screen place-items-center">
          <ThemeProvider defaultTheme="dark" storageKey="supabase-theme">
            <Auth
              supabaseClient={supabaseClient}
              appearance={{ theme: "dark" }}
              providers={["github", "google"]}
              redirectTo="http://localhost:3000/app/dashboard"
            />
          </ThemeProvider>
        </div>
      ),
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <Home />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/request-submission",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <RequestSubmission />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/employee-management",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <EmployeeManagement />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/employee-profile/:id",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <EmployeeProfile />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/requests/:type",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <RequestsManagement />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/company-management",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <CompanyManagement />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/account",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <Account />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/app/dashboard",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <Dashboard />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/app/calendar",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <EventCalendar />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/app/notifications",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <Notifications />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/app/settings",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <UserSettings />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/app/status",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <ApplicationStatus />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/registration-requests",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <RegistrationRequests />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="supabase-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
