
interface CardSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function CardSection({
  title,
  description,
  children,
  className = "",
}: CardSectionProps) {
  return (
    <section className={`space-y-4 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
