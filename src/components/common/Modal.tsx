/**
 * Modal.tsx
 * A reusable modal component for dialogs, alerts, and other overlay content
 */

import React, { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  testId?: string;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'full';
  preventScroll?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = '',
  style = {},
  id,
  testId,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  showCloseButton = true,
  size = 'md',
  preventScroll = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close on escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);
  
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (!preventScroll) return;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, preventScroll]);
  
  // Handle outside click
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (!closeOnOutsideClick) return;
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-full mx-4',
  };
  
  // Don't render anything if modal is closed
  if (!isOpen) return null;
  
  // Use portal to render outside of normal DOM hierarchy
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleOutsideClick}
      data-testid={`${testId}-overlay`}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        id={id}
        data-testid={testId}
        className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} ${className}`}
        style={style}
        tabIndex={-1}
      >
        {/* Header with title and close button */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b">
            {title && (
              <h3 className="text-lg font-semibold" data-testid={`${testId}-title`}>
                {title}
              </h3>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                ariaLabel="Close modal"
                testId={`${testId}-close-button`}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            )}
          </div>
        )}
        
        {/* Body content */}
        <div className="p-4">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="p-4 border-t">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default React.memo(Modal);
