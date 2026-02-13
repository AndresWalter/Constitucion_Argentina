import { cn } from '../../lib/utils';

export function Button({ children, variant = 'primary', className, onClick, ...props }) {
    const baseStyles = 'px-6 py-3 font-medium transition-all duration-200 rounded-pill shadow-md';

    const variants = {
        primary: 'bg-legal-gold text-white hover:bg-legal-gold-dark active:scale-95',
        secondary: 'bg-legal-blue-light text-white hover:bg-legal-blue active:scale-95',
        outline: 'border-2 border-legal-gold text-legal-gold hover:bg-legal-gold hover:text-white'
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
}
