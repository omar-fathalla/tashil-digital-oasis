
import { BadgeCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CompanyRegistrationSuccessProps {
  onNavigateToDashboard: () => void;
}

export const CompanyRegistrationSuccess = ({ onNavigateToDashboard }: CompanyRegistrationSuccessProps) => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 py-12">
      <Card className="w-full max-w-lg border-none shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-4">
            <BadgeCheck className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Registration Successful!</CardTitle>
          <CardDescription className="text-lg">
            Your company has been successfully registered on the Tashil platform
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Registration process is complete. You can now access all platform services
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild className="bg-primary hover:bg-primary-700">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
