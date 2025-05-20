import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DailyPracticeStatusIndicatorProps {
  status: 'idle' | 'adding' | 'added' | 'removing' | 'removed' | 'error';
  message?: string;
  onDismiss?: () => void;
  className?: string;
  autoDismiss?: boolean;
  autoDismissTime?: number; // Time in ms
}

/**
 * Component that shows status of daily practice operations
 * Can be used to provide feedback when practices are added/removed from daily
 */
const DailyPracticeStatusIndicator: React.FC<DailyPracticeStatusIndicatorProps> = ({
  status,
  message,
  onDismiss,
  className,
  autoDismiss = true,
  autoDismissTime = 3000, // Default 3 seconds
}) => {
  const [visible, setVisible] = useState(status !== 'idle');

  // Auto dismiss after specified time
  useEffect(() => {
    setVisible(status !== 'idle');
    
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (status !== 'idle' && autoDismiss) {
      timeoutId = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, autoDismissTime);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [status, autoDismiss, autoDismissTime, onDismiss]);
  
  if (!visible) return null;
  
  const getStatusColor = () => {
    switch (status) {
      case 'adding':
        return 'bg-blue-100 border-blue-300 text-blue-700';
      case 'added':
        return 'bg-green-100 border-green-300 text-green-700';
      case 'removing':
        return 'bg-orange-100 border-orange-300 text-orange-700';
      case 'removed':
        return 'bg-gray-100 border-gray-300 text-gray-700';
      case 'error':
        return 'bg-red-100 border-red-300 text-red-700';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case 'adding':
        return '⏳'; // Hourglass
      case 'added':
        return '✓'; // Checkmark
      case 'removing':
        return '⏳'; // Hourglass
      case 'removed':
        return '✓'; // Checkmark
      case 'error':
        return '⚠️'; // Warning
      default:
        return 'ℹ️'; // Info
    }
  };
  
  const getStatusText = () => {
    if (message) return message;
    
    switch (status) {
      case 'adding':
        return 'Adding to daily practices...';
      case 'added':
        return 'Added to daily practices';
      case 'removing':
        return 'Removing from daily practices...';
      case 'removed':
        return 'Removed from daily practices';
      case 'error':
        return 'Error updating daily practices';
      default:
        return '';
    }
  };
  
  return (
    <div className={cn(
      'fixed bottom-4 right-4 p-3 rounded-lg border shadow-md transition-all duration-200 transform z-50 flex items-center space-x-2',
      getStatusColor(),
      className
    )}>
      <span className="text-lg">{getStatusIcon()}</span>
      <span className="text-sm font-medium">{getStatusText()}</span>
      {onDismiss && (
        <button
          onClick={() => {
            setVisible(false);
            onDismiss();
          }}
          className="ml-2 text-sm opacity-70 hover:opacity-100"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default DailyPracticeStatusIndicator;
