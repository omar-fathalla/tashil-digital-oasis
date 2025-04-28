
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
}

export function ThemeToggle({ className, variant = "outline" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={toggleTheme}
      className={cn(
        "w-full transition-all duration-200 hover:scale-[1.02]",
        className
      )}
    >
      {theme === "light" ? (
        <>
          <Moon className="h-5 w-5 mr-2" />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun className="h-5 w-5 mr-2" />
          <span>Light Mode</span>
        </>
      )}
    </Button>
  );
}
