import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: string;
  label?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, type, icon: Icon, error, label, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ps-1 block">
            {label}
          </label>
        )}
        <div className="relative group">
          {Icon && (
            <Icon className="absolute start-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-(--primary) transition-colors stroke-[2px]" />
          )}
          <input
            type={type}
            className={cn(
              "w-full h-14 bg-slate-50 border border-slate-100 rounded-(--radius) text-sm font-medium outline-none focus:border-(--primary) focus:bg-white transition-all",
              Icon ? "ps-12 pe-4" : "px-4",
              error ? "border-red-500 focus:border-red-500" : "",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest ps-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)
FormInput.displayName = "FormInput"

export { FormInput }
