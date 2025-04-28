
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarNav from "./SidebarNav";
import Footer from "./Footer";

export default function RootLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <SidebarNav />
        <main className="flex-1">
          <div className="container py-4">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
}
