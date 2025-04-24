
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function RootLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 w-full">
            <Outlet />
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
