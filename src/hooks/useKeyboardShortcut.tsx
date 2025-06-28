/**
 * useKeyboardShortcut.tsx
 * A custom hook for managing keyboard shortcuts
 */

import { useEffect, useCallback } from 'react';

type KeyCombination = string | string[];
type ShortcutCallback = (event: KeyboardEvent) => void;
type KeyboardOptions = {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  keyevent?: 'keydown' | 'keyup' | 'keypress';
};

/**
 * Custom hook to handle keyboard shortcuts
 * 
 * @param keyCombination Key or keys to listen for (e.g., 'a', 'Escape', ['Alt+s', 'Control+f'])
 * @param callback Function to execute when the key combination is pressed
 * @param options Additional options for the keyboard event handling
 */
export const useKeyboardShortcut = (
  keyCombination: KeyCombination,
  callback: ShortcutCallback,
  options: KeyboardOptions = {}
): void => {
  const {
    preventDefault = true,
    stopPropagation = true,
    keyevent = 'keydown'
  } = options;
  
  // Parse the key combination string
  const parseKeyCombination = useCallback((combination: string): { key: string; ctrl: boolean; alt: boolean; shift: boolean; meta: boolean } => {
    const parts = combination.split('+').map(part => part.trim().toLowerCase());
    
    return {
      key: parts.filter(part => !['ctrl', 'control', 'alt', 'shift', 'meta', 'cmd', 'command'].includes(part))[0] || '',
      ctrl: parts.some(part => part === 'ctrl' || part === 'control'),
      alt: parts.some(part => part === 'alt'),
      shift: parts.some(part => part === 'shift'),
      meta: parts.some(part => part === 'meta' || part === 'cmd' || part === 'command')
    };
  }, []);
  
  // Handle the keyboard event
  const handleKeyEvent = useCallback((event: KeyboardEvent) => {
    // Skip if focus is in input/textarea
    if (
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement ||
      document.activeElement?.getAttribute('role') === 'textbox'
    ) {
      return;
    }
    
    // Get all key combinations to check
    const combinations = Array.isArray(keyCombination) ? keyCombination : [keyCombination];
    
    // Check each combination
    for (const combo of combinations) {
      const { key, ctrl, alt, shift, meta } = parseKeyCombination(combo);
      
      // Check if the combination matches
      const keyMatch = 
        // Case-insensitive check for letter key
        (key.length === 1 && event.key.toLowerCase() === key.toLowerCase()) || 
        // Exact match for special keys like 'Escape', 'ArrowLeft', etc.
        (key.length > 1 && event.key === key);
        
      const modifiersMatch = 
        (ctrl === event.ctrlKey) &&
        (alt === event.altKey) &&
        (shift === event.shiftKey) &&
        (meta === event.metaKey);
      
      if (keyMatch && modifiersMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        
        if (stopPropagation) {
          event.stopPropagation();
        }
        
        callback(event);
        return;
      }
    }
  }, [keyCombination, callback, preventDefault, stopPropagation, parseKeyCombination]);
  
  // Add and remove event listener
  useEffect(() => {
    document.addEventListener(keyevent, handleKeyEvent);
    
    return () => {
      document.removeEventListener(keyevent, handleKeyEvent);
    };
  }, [keyevent, handleKeyEvent]);
};

export default useKeyboardShortcut;
