import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className = '', hover = false, glow = false }: CardProps) {
  return (
    <div
      className={`
        glass rounded-2xl p-8
        ${hover ? 'transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl' : ''}
        ${glow ? 'glow-primary' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
