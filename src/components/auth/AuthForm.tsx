
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuthForm } from "@/hooks/useAuthForm";
import { z } from "zod";
import { Mail, AlertTriangle } from "lucide-react";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const AuthForm = () => {
  const location = useLocation();
  const justRegistered = location.state?.justRegistered;

  const {
    isLoading,
    isSignUp,
    email,
    password,
    error,
    setIsSignUp,
    setEmail,
    setPassword,
    handleSubmit,
    handleSignOut,
  } = useAuthForm();

  const [step, setStep] = useState(1);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateStep1 = () => {
    try {
      authSchema.parse({ email, password, confirmPassword });
      setValidationError(null);
      setStep(2);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationError(err.errors[0].message);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      validateStep1();
    } else {
      await handleSubmit(e);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isSignUp ? "Create New Account" : "Login"}</CardTitle>
        <CardDescription>
          {isSignUp
            ? "Create a new account to access Tashil Platform"
            : "Welcome back! Please log in to your account"}
        </CardDescription>
        {isSignUp && (
          <Progress 
            value={step === 1 ? 50 : 100} 
            className="mt-2"
          />
        )}
      </CardHeader>

      {justRegistered && (
        <div className="px-6">
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Mail className="h-5 w-5 text-blue-500 mr-2" />
            <AlertDescription className="text-blue-700">
              <p className="font-medium">Please check your email</p>
              <p className="text-sm mt-1">
                We've sent a verification link to your email address. 
                Please verify your email to get full access to the platform.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <form onSubmit={handleFormSubmit}>
        <CardContent className="space-y-4">
          {(error || validationError) && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>{error || validationError}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationError(null);
              }}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setValidationError(null);
              }}
              required
            />
          </div>
          {isSignUp && step === 1 && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setValidationError(null);
                }}
                required
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Loading..."
              : isSignUp
              ? step === 1
                ? "Next Step"
                : "Create Account"
              : "Login"}
          </Button>
          {step === 1 && (
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setValidationError(null);
              }}
            >
              {isSignUp
                ? "Already have an account? Log in"
                : "Don't have an account? Sign up now"}
            </Button>
          )}
          {!isSignUp && (
            <Button 
              type="button" 
              variant="destructive" 
              className="w-full"
              onClick={handleSignOut}
            >
              Logout
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
