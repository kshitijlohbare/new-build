/**
 * SearchBar.tsx
 * A reusable search bar component with customizable styles and accessibility features
 */

import React, { useState, useCallback, forwardRef } from 'react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  testId?: string;
  label?: string;
  hideLabel?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(({
  value,
  onChange,
  placeholder = 'search',
  className = '',
  style = {},
  id = 'search-bar',
  testId = 'search-bar',
  label = 'Search',
  hideLabel = true,
  inputRef // legacy prop, will fallback to forwarded ref
}, ref) => {
  // Debounce search to avoid excessive re-renders
  const [localValue, setLocalValue] = useState(value);
  const inputId = `${id}-input`;

  // Use callback to avoid recreation on each render
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  }, [onChange]);

  return (
    <div 
      className={`box-border flex flex-row justify-center items-center px-[20px] py-[10px] gap-[10px] w-[380px] h-[52px] border rounded-[100px] ${className}`} 
      id={id} 
      data-testid={testId}
      style={{ 
        backgroundColor: 'var(--colors-primary-main)',
        borderColor: 'var(--colors-neutral-white)',
        boxShadow: 'var(--shadows-DEFAULT)',
        ...style 
      }}
    >
      {/* Visually hidden label for accessibility */}
      {label && (
        <label 
          htmlFor={inputId}
          className={hideLabel ? "sr-only" : "search-label"}
          id={`${id}-label`}
        >
          {label}
        </label>
      )}
      
      {/* Search Input Field */}
      <input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={handleInputChange}
        className="flex-grow bg-transparent outline-none font-normal text-[12px] leading-[16px] lowercase placeholder-white/90"
        style={{
          fontFamily: 'var(--typography-fontFamily-primary)',
          color: 'var(--colors-neutral-lightestGray)'
        }}
        id={inputId} 
        data-testid={`${testId}-input`}
        aria-label={label}
        ref={inputRef || ref}
      />
      {/* Search Button */}
      <div 
        className="flex flex-row justify-center items-center w-[31px] h-[32px] flex-none" 
        id={`${id}-button`} 
        data-testid={`${testId}-button`}
      >
        {/* Search Icon */}
        <svg 
          className="w-[19.28px] h-[20px] text-white" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          id={`${id}-icon`} 
          data-testid={`${testId}-icon`}
        >
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
});

export default React.memo(SearchBar);
