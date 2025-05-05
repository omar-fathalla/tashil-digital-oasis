
import { useState, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootLayout from "@/components/layout/RootLayout";
import RegistrationRequests from "@/pages/RegistrationRequests";

const App = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const queryClient = new QueryClient();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Do not render anything until the app is hydrated
  if (!isHydrated) {
    return null;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <RootLayout>
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Employee Management System</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Welcome to the employee management dashboard. Navigate using the sidebar.
            </p>
          </div>
        </RootLayout>
      ),
    },
    {
      path: "/registration-requests",
      element: (
        <RootLayout>
          <RegistrationRequests />
        </RootLayout>
      ),
    }
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="supabase-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
