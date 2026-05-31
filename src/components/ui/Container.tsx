<<<<<<< HEAD
export default function Container({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="max-w-6xl mx-auto px-4">{children}</div>;
=======
import { twMerge } from "tailwind-merge";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={twMerge("max-w-6xl mx-auto px-4", className)}>
      {children}
    </div>
  );
>>>>>>> master
}