import { cn } from '@/components/ui/cn';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn('container-premium', className)} {...props}>
      {children}
    </div>
  );
}
