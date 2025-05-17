import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[20px] bg-white border border-[rgba(4,196,213,0.3)] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] transition-all duration-200",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export { Card }