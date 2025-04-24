
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Info, HelpCircle } from "lucide-react";

export const DesktopNav = () => {
  return (
    <div className="hidden md:flex items-center space-x-1">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/about">
          <Info className="h-4 w-4 mr-1" />
          About
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link to="/faq">
          <HelpCircle className="h-4 w-4 mr-1" />
          FAQ
        </Link>
      </Button>
    </div>
  );
};
