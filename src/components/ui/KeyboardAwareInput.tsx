import React, { useRef, InputHTMLAttributes, forwardRef, ForwardedRef } from 'react';
import { useKeyboardAwareInput } from '../../hooks/useVisualViewport';

type KeyboardAwareInputProps = InputHTMLAttributes<HTMLInputElement> & {
  containerClassName?: string;
};

/**
 * An input component that adjusts its position when the mobile keyboard appears
 */
export const KeyboardAwareInput = forwardRef((
  { containerClassName = '', className = '', onFocus, onBlur, ...props }: KeyboardAwareInputProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { handleFocus, handleBlur } = useKeyboardAwareInput(
    // Use the forwarded ref if available, otherwise use our local ref
    (ref as React.RefObject<HTMLInputElement>) || inputRef
  );
  
  return (
    <div className={containerClassName}>
      <input
        ref={ref || inputRef}
        className={className}
        onFocus={(e) => {
          handleFocus();
          onFocus && onFocus(e);
        }}
        onBlur={(e) => {
          handleBlur();
          onBlur && onBlur(e);
        }}
        {...props}
      />
    </div>
  );
});

KeyboardAwareInput.displayName = 'KeyboardAwareInput';

/**
 * A textarea component that adjusts its position when the mobile keyboard appears
 */
export const KeyboardAwareTextarea = forwardRef((
  { containerClassName = '', className = '', onFocus, onBlur, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { containerClassName?: string },
  ref: ForwardedRef<HTMLTextAreaElement>
) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { handleFocus, handleBlur } = useKeyboardAwareInput(
    (ref as React.RefObject<HTMLTextAreaElement>) || textareaRef
  );
  
  return (
    <div className={containerClassName}>
      <textarea
        ref={ref || textareaRef}
        className={className}
        onFocus={(e) => {
          handleFocus();
          onFocus && onFocus(e);
        }}
        onBlur={(e) => {
          handleBlur();
          onBlur && onBlur(e);
        }}
        {...props}
      />
    </div>
  );
});

KeyboardAwareTextarea.displayName = 'KeyboardAwareTextarea';
