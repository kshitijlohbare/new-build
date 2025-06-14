import { useState } from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg'; 
  fallbackText?: string;
  className?: string;
}

export const UserAvatar = ({ 
  src, 
  alt, 
  size = 'md',
  fallbackText,
  className = ''
}: UserAvatarProps) => {
  const [error, setError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base'
  };
  
  const displayText = fallbackText || (alt ? alt.charAt(0).toUpperCase() : '');
  
  if (src && !error) {
    return (
      <img
        src={src}
        alt={alt}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
        onError={() => setError(true)}
      />
    );
  }
  
  return (
    <div 
      className={`rounded-full bg-[#04C4D5] flex items-center justify-center text-white font-medium ${sizeClasses[size]} ${className}`}
    >
      {displayText || <User className="w-4 h-4" />}
    </div>
  );
};

export default UserAvatar;
