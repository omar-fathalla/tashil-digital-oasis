
interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function CardGrid({ children, columns = 3, className = "" }: CardGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div 
      className={`
        grid gap-6 
        ${gridCols[columns]} 
        ${className}
        [perspective:1000px]
        [@media(hover:hover)]:hover:children:hover:rotate-y-1
      `}
    >
      {children}
    </div>
  );
}
