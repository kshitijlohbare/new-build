import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";

// Define the shape of the toast properties that can be passed to the toast() function.
// This extends the props of the underlying Radix UI Toast Root component.
export interface ToastProps extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success"; // Re-enabled for consistent typing
}

// Module-level state for the single, global toast
let currentOpen = false;
let currentToastProps: ToastProps = {};
type Listener = (open: boolean, props: ToastProps) => void;
const listeners: Set<Listener> = new Set();

// Function to notify all subscribed components of state changes
const updateListeners = () => {
  listeners.forEach(listener => listener(currentOpen, currentToastProps));
};

// Public function to display a toast
const showToast = (props: ToastProps) => {
  currentToastProps = props;
  currentOpen = true;
  updateListeners();
};

// Public function to hide the current toast
const closeToast = () => {
  if (currentOpen) { // Update only if currently open
    currentOpen = false;
    // currentToastProps could be reset here if needed, e.g., currentToastProps = {};
    // For now, keeping them allows fade-out animations to potentially use the content.
    updateListeners();
  }
};

// The useToast hook
const useToast = () => {
  // Local state within the component using the hook, kept in sync with global state
  const [open, setOpenState] = React.useState(currentOpen);
  const [props, setPropsState] = React.useState<ToastProps>(currentToastProps);

  React.useEffect(() => {
    // Define the listener function for this specific hook instance
    const listener: Listener = (newOpen, newProps) => {
      setOpenState(newOpen);
      setPropsState(newProps);
    };

    // Subscribe to global state changes
    listeners.add(listener);
    // Immediately sync with the current global state when the component mounts
    listener(currentOpen, currentToastProps);

    // Unsubscribe when the component unmounts
    return () => {
      listeners.delete(listener);
    };
  }, []); // Empty dependency array ensures this effect runs only on mount and unmount

  return {
    toast: showToast,     // Function to trigger/show a toast
    open,                 // Boolean indicating if the toast should be open
    setOpen: closeToast,  // Function to close the toast (used by onOpenChange in Toaster)
    // Provide direct access to common toast content properties
    title: props.title,
    description: props.description,
    action: props.action,
    // Expose all props for flexibility, though Toaster currently destructures specific ones
    props,
  };
};

export { useToast };