import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "purple" | "dark";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "dark", children, ...props }, ref) => {
    const variants = {
      default: "bg-white/10 border-white/20",
      purple: "bg-purple-500/10 border-purple-300/20",
      dark: "bg-black/20 border-white/10"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-lg border backdrop-blur-md shadow-lg",
          "transition-all duration-200 hover:shadow-xl hover:bg-opacity-20",
          variants[variant],
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="relative z-10 p-6">
          {children}
        </div>
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export default GlassCard;