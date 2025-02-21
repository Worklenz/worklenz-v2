import { ReactNode } from 'react';

interface CollapsibleProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
  color?: string;
}

const Collapsible = ({ isOpen, children, className = '', color }: CollapsibleProps) => {
  return (
    <div
      style={{
        borderLeft: `3px solid ${color}`,
      }}
      className={`transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Collapsible;
