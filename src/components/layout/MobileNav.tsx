import { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { NavLogo } from "./NavLogo";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-2">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="flex flex-col gap-4 py-4">
            <NavLogo />
            <SheetClose asChild>
              <NavLink onClick={() => setIsOpen(false)} to="/" className={`${pathname === "/" ? "text-primary" : "text-foreground/80"} py-2 text-center`}>
                الرئيسية
              </NavLink>
            </SheetClose>
            <SheetClose asChild>
              <NavLink onClick={() => setIsOpen(false)} to="/about" className={`${pathname === "/about" ? "text-primary" : "text-foreground/80"} py-2 text-center`}>
                من نحن
              </NavLink>
            </SheetClose>
            <SheetClose asChild>
              <NavLink onClick={() => setIsOpen(false)} to="/services" className={`${pathname === "/services" ? "text-primary" : "text-foreground/80"} py-2 text-center`}>
                الخدمات
              </NavLink>
            </SheetClose>
            <SheetClose asChild>
              <NavLink onClick={() => setIsOpen(false)} to="/company-registration" className={`${pathname === "/company-registration" ? "text-primary" : "text-foreground/80"} py-2 text-center`}>
                تسجيل شركة
              </NavLink>
            </SheetClose>
            <SheetClose asChild>
              <NavLink onClick={() => setIsOpen(false)} to="/request-submission" className={`${pathname === "/request-submission" ? "text-primary" : "text-foreground/80"} py-2 text-center`}>
                تقديم طلب
              </NavLink>
            </SheetClose>
            <SheetClose asChild>
              <NavLink onClick={() => setIsOpen(false)} to="/application-status" className={`${pathname === "/application-status" ? "text-primary" : "text-foreground/80"} py-2 text-center`}>
                حالة الطلب
              </NavLink>
            </SheetClose>
            <SheetClose asChild>
              <NavLink onClick={() => setIsOpen(false)} to="/database" className={`${pathname === "/database" ? "text-primary" : "text-foreground/80"} py-2 text-center`}>
                قاعدة البيانات
              </NavLink>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
