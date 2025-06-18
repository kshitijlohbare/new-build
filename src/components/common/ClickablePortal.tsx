import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ClickablePortalProps {
  children: React.ReactNode;
  onClose?: () => void;
  isOpen: boolean;
}

/**
 * A component that renders its children in a portal outside of the normal DOM flow
 * This guarantees that click events won't be blocked by parent elements with
 * z-index or pointer-events issues
 */
const ClickablePortal: React.FC<ClickablePortalProps> = ({ 
  children, 
  onClose,
  isOpen 
}) => {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  
  useEffect(() => {
    // Create a portal root if it doesn't exist
    let root = document.getElementById('clickable-portal-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'clickable-portal-root';
      root.style.position = 'fixed';
      root.style.top = '0';
      root.style.left = '0';
      root.style.width = '100vw';
      root.style.height = '100vh';
      root.style.zIndex = '9999';
      root.style.pointerEvents = 'none';
      root.style.display = 'flex';
      root.style.alignItems = 'center';
      root.style.justifyContent = 'center';
      document.body.appendChild(root);
    }
    
    setPortalRoot(root);
    
    // Prevent scrolling of the body when portal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    // Cleanup function
    return () => {
      if (isOpen) {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  // Don't render anything if portalRoot doesn't exist or if not open
  if (!portalRoot || !isOpen) return null;

  // Use createPortal to render children into portalRoot
  return createPortal(
    <div 
      className="portal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        pointerEvents: 'auto'
      }}
      onClick={(e) => {
        // Close when clicking the overlay
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div 
        className="portal-content"
        style={{
          pointerEvents: 'auto',
          position: 'relative',
          zIndex: 10000
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    portalRoot
  );
};

export default ClickablePortal;
