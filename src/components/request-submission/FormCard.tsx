
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
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>{footer}</CardFooter>
    </Card>
  );
};
