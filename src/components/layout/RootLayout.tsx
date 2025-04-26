
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 w-full overflow-x-hidden transition-all duration-300 ease-in-out">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
