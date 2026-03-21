import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-(--primary) text-white shadow-sm hover:bg-(--primary)/90",
        secondary:
          "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600",
        outline:
          "border-slate-200 text-slate-900 bg-white hover:bg-slate-50 shadow-sm",
        premium:
          "bg-(--primary) text-white border-white/20 shadow-[0_10px_20px_rgba(0,115,230,0.3)] hover:shadow-[0_15px_25px_rgba(0,115,230,0.4)] transition-all duration-300",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900",
        link: "text-(--primary) underline-offset-4 hover:underline",
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
