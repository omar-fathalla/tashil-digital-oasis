
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const VerifyEmail = () => {
  const { user, resendVerificationEmail } = useAuth();
  const { toast } = useToast();
  const [resending, setResending] = useState(false);
  const [justSent, setJustSent] = useState(false);

  const handleResendEmail = async () => {
    if (resending) return;
    
    setResending(true);
    try {
      await resendVerificationEmail();
      setJustSent(true);
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox and spam folder.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Resend",
        description: error.message || "An error occurred while sending the verification email.",
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            Please verify your email address to access all features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              We've sent a verification email to <strong>{user?.email || "your email address"}</strong>.
              Click the link in the email to verify your account.
            </AlertDescription>
          </Alert>
          
          {justSent && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              <AlertDescription className="text-green-700">
                Verification email sent! Please check your inbox and spam folder.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="text-sm text-slate-600">
            <p>If you don't see the email in your inbox:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Check your spam or junk folder</li>
              <li>Ensure you entered the correct email address</li>
              <li>Wait a few minutes for the email to arrive</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            className="w-full" 
            onClick={handleResendEmail} 
            disabled={resending}
          >
            {resending ? "Sending..." : "Resend Verification Email"}
          </Button>
          <div className="text-xs text-center text-slate-500">
            You won't be able to access the system until your email is verified.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;
