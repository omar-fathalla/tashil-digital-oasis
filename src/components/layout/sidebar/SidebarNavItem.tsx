
import { Link, useLocation } from "react-router-dom";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { AnimatedBadge } from "../AnimatedBadge";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: any;
  badge?: string;
  badgeVariant?: "new" | "count";
}

export function SidebarNavItem({ href, label, icon: Icon, badge, badgeVariant }: SidebarNavItemProps) {
  const { pathname } = useLocation();
  const isActive = pathname === href;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild 
        isActive={isActive}
        tooltip={label}
        className={cn(
          "transition-all duration-200 hover:scale-[1.02]",
          "relative overflow-hidden",
          "before:absolute before:left-0 before:top-0 before:h-full before:w-1",
          "before:bg-primary before:transform before:scale-y-0",
          "before:transition-transform before:duration-200",
          "hover:translate-x-1",
          isActive && "before:scale-y-100 bg-accent/50"
        )}
      >
        <Link to={href} className="flex items-center gap-3">
          <Icon className="h-5 w-5" />
          <span className="font-medium">{label}</span>
          {badge && (
            <AnimatedBadge 
              value={badge} 
              variant={badgeVariant} 
            />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
