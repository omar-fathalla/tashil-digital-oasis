
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

export const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAnonymousLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) throw error;
      
      toast({
        title: "Login Successful",
        description: "Welcome to Tashil Platform",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Anonymous login error:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Continue as Guest"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
