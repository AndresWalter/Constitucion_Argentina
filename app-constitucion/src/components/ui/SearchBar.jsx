import { Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export function SearchBar({ value, onChange, placeholder = 'Buscar artículos...', className }) {
    return (
        <div className={cn('relative w-full', className)}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-legal-gray-muted">
                <Search size={20} strokeWidth={1.5} />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    'w-full pl-12 pr-4 py-3 rounded-pill',
                    'bg-white/10 backdrop-blur-md',
                    'border border-white/20',
                    'text-white placeholder:text-white/60',
                    'focus:outline-none focus:ring-2 focus:ring-legal-gold/50',
                    'transition-all duration-200'
                )}
            />
        </div>
    );
}
