import { cn } from '../../lib/utils';

export function Card({ children, className, hover = true, ...props }) {
    return (
        <div
            className={cn(
                'bg-white rounded-[20px] shadow-card p-6 transition-all duration-200',
                hover && 'hover:shadow-lg hover:-translate-y-1',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardTitle({ children, className }) {
    return (
        <h3 className={cn('font-semibold text-legal-gray-text text-lg mb-2', className)}>
            {children}
        </h3>
    );
}

export function CardDescription({ children, className }) {
    return (
        <p className={cn('text-legal-gray-muted text-sm', className)}>
            {children}
        </p>
    );
}
