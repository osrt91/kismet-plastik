import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-navy-900 text-cream-50 [a&]:hover:bg-navy-800",
        secondary:
          "bg-cream-100 text-navy-900 [a&]:hover:bg-cream-50",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-navy-700/30 text-navy-900 [a&]:hover:bg-navy-900/5 dark:border-cream-50/20 dark:text-cream-50",
        ghost: "[a&]:hover:bg-navy-900/5 [a&]:hover:text-navy-900 dark:[a&]:hover:bg-cream-50/10",
        link: "text-navy-900 underline-offset-4 [a&]:hover:underline dark:text-cream-50",
        amber: "bg-amber-500/15 text-amber-600 [a&]:hover:bg-amber-500/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
