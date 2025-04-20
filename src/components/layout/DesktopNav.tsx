import { NavLink, useLocation } from "react-router-dom";
import { NavLogo } from "./NavLogo";

export function DesktopNav() {
  const { pathname } = useLocation();
  
  return (
    <nav className="hidden md:flex items-center space-x-6">
      <NavLink to="/" className={pathname === "/" ? "text-primary" : "text-foreground/80 hover:text-foreground"}>
        الرئيسية
      </NavLink>
      <NavLink to="/about" className={pathname === "/about" ? "text-primary" : "text-foreground/80 hover:text-foreground"}>
        من نحن
      </NavLink>
      <NavLink to="/services" className={pathname === "/services" ? "text-primary" : "text-foreground/80 hover:text-foreground"}>
        الخدمات
      </NavLink>
      <NavLink to="/company-registration" className={pathname === "/company-registration" ? "text-primary" : "text-foreground/80 hover:text-foreground"}>
        تسجيل شركة
      </NavLink>
      <NavLink to="/request-submission" className={pathname === "/request-submission" ? "text-primary" : "text-foreground/80 hover:text-foreground"}>
        تقديم طلب
      </NavLink>
      <NavLink to="/application-status" className={pathname === "/application-status" ? "text-primary" : "text-foreground/80 hover:text-foreground"}>
        حالة الطلب
      </NavLink>
      <NavLink to="/database" className={pathname === "/database" ? "text-primary" : "text-foreground/80 hover:text-foreground"}>
        قاعدة البيانات
      </NavLink>
    </nav>
  );
}
