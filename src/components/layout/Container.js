import { cn } from '@/components/ui/cn';
export function Container({ children, className, ...props }) {
    return (<div className={cn('container-premium', className)} {...props}>
      {children}
    </div>);
}
