import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "card-base bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow duration-200",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export { Card }