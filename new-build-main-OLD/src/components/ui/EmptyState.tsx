import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon,
  title,
  message,
  action,
  className = ''
}: EmptyStateProps) => {
  return (
    <div 
      className={`text-center p-10 rounded-[20px] border border-[rgba(4,196,213,0.3)] bg-white shadow-sm ${className}`}
    >
      {icon && (
        <div className="flex justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-[#148BAF] font-happy-monkey text-lg mb-2">{title}</h3>
      <p className="text-black font-happy-monkey mb-6">{message}</p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
