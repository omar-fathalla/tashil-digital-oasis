
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
import { useAuthForm } from "@/hooks/useAuthForm";

export const AuthForm = () => {
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

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isSignUp ? "Create New Account" : "Login"}</CardTitle>
        <CardDescription>
          {isSignUp
            ? "Create a new account to access Tashil Platform"
            : "Welcome back! Please log in to your account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Loading..."
              : isSignUp
              ? "Create Account"
              : "Login"}
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "Already have an account? Log in"
              : "Don't have an account? Sign up now"}
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            className="w-full mt-4"
            onClick={handleSignOut}
          >
            Logout
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
