import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-happy-monkey lowercase transition-all touch-manipulation select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#04C4D5] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-white hover:bg-white active:bg-gray-50 text-[#148BAF] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] border border-[#04C4D5] active:shadow-[inset_1px_1px_3px_rgba(73,218,234,0.3)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        outline:
          "border border-[#04C4D5] bg-white hover:bg-white active:bg-gray-50 text-[#148BAF] active:shadow-[inset_1px_1px_3px_rgba(73,218,234,0.3)]",
        secondary:
          "bg-white text-[#148BAF] hover:bg-white active:bg-gray-50 border border-[rgba(4,196,213,0.3)] active:shadow-[inset_1px_1px_3px_rgba(73,218,234,0.2)]",
        ghost: "hover:bg-white active:bg-gray-50 text-[#148BAF]",
        link: "text-[#148BAF] underline-offset-4 hover:underline active:opacity-80",
      },
      size: {
        default: "min-h-[44px] h-auto px-4 py-3 sm:h-10 sm:py-2",
        sm: "min-h-[40px] h-auto rounded-md px-3 py-2 sm:h-9 sm:py-1",
        lg: "min-h-[48px] h-auto rounded-md px-6 py-3 sm:h-11 sm:px-8 sm:py-2",
        icon: "min-h-[44px] min-w-[44px] h-auto w-auto p-2 sm:h-10 sm:w-10 sm:p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }