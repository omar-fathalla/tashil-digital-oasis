
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const SuccessState = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 py-12">
      <Card className="w-full max-w-lg border-none shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Request Submitted!</CardTitle>
          <CardDescription className="text-lg">
            Your request has been successfully submitted for processing.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-2 text-gray-600">Request Reference Number:</p>
          <p className="mb-6 font-mono font-medium text-lg">REQ-2025-04873</p>
          <p className="mb-6 text-gray-600">
            You can track the status of your request in the Application Status page.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/application-status">
                Track Status
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
