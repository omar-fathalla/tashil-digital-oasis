
import { ReactNode } from "react";
import { BaseCard } from "@/components/ui/card-layout/BaseCard";

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
    <BaseCard
      title={title}
      description={description}
      variant="primary"
      className="max-w-2xl mx-auto"
    >
      <div className="space-y-6">
        {children}
        <div className="flex justify-end">{footer}</div>
      </div>
    </BaseCard>
  );
};
