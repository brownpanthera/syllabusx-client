import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 dark:border-neutral-800 dark:focus:ring-neutral-800 cursor-default",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neutral-50 text-neutral-900 hover:bg-neutral-50/80",
        secondary:
          "border-transparent bg-neutral-800 text-neutral-50 hover:bg-neutral-800/80",
        destructive:
          "border-transparent bg-red-900 text-red-50 hover:bg-red-900/80",
        outline: "text-neutral-50",
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