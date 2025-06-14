import { useEffect } from 'react';

/**
 * Component to inject a simple favicon if missing
 */
export function Favicon() {
  useEffect(() => {
    // Check if favicon exists
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (!existingFavicon) {
      // Create a simple data URL favicon with CC color
      const faviconUrl = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🌵</text></svg>';
      
      // Create link element
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = faviconUrl;
      
      // Add to head
      document.head.appendChild(link);
    }
  }, []);

  return null;
}
