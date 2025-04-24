
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface FormCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export const FormCard = ({
  title,
  description,
  children,
  footer,
}: FormCardProps) => {
  return (
    <Card className="border-none shadow-lg w-full mx-auto">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
        <CardDescription className="text-sm md:text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 md:px-6">{children}</CardContent>
      <CardFooter className="px-4 md:px-6">{footer}</CardFooter>
    </Card>
  );
};
