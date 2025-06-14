import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-3 py-1.5 sm:px-2.5 sm:py-0.5 text-xs font-happy-monkey lowercase transition-all focus:outline-none focus:ring-2 focus:ring-[#04C4D5] focus:ring-offset-2 min-h-[44px] sm:min-h-auto justify-center cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "border-[#04C4D5] bg-white text-[#148BAF] shadow-[1px_1px_2px_rgba(73,218,234,0.3)] hover:bg-[#F7FFFF] active:scale-95",
        secondary:
          "border-[rgba(4,196,213,0.3)] bg-[#F7FFFF] text-[#148BAF] hover:bg-[#E6F9FA] active:scale-95",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95",
        outline: "text-[#148BAF] border-[#04C4D5] hover:bg-[#F7FFFF] active:scale-95",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }