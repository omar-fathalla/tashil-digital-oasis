
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import { useAuthForm } from "@/hooks/useAuthForm";

export const AuthForm = () => {
  const { isLoading, handleAnonymousLogin } = useAuthForm();
  const [error, setError] = useState<string | null>("Anonymous sign-ins are disabled");

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome to Tashil Platform</CardTitle>
        <CardDescription>
          No account needed, continue as a guest to access the platform
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="pt-4">
          <Button 
            onClick={handleAnonymousLogin} 
            className="w-full" 
            disabled={isLoading || error === "Anonymous sign-ins are disabled"}
          >
            {isLoading ? "Loading..." : "Continue as Guest"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
