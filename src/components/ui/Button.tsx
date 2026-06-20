"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { tv, type VariantProps } from "@/utils/tv";

const buttonVariants = tv({
  base: [
    "relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg",
    "text-sm font-medium transition-colors duration-100",
    "outline-none focus-visible:shadow-[var(--shadow-button-important-focus)]",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  variants: {
    variant: {
      neutral: "",
    },
    mode: {
      filled:  "bg-text-strong-950 text-bg-white-0 hover:opacity-90",
      stroke:  "border border-stroke-soft-200 bg-bg-white-0 text-text-strong-950 shadow-xs hover:bg-bg-weak-50",
      lighter: "bg-bg-weak-50 text-text-strong-950 hover:bg-bg-soft-200",
      ghost:   "bg-transparent text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950",
    },
    size: {
      xs: "h-7 px-2.5 text-[13px]",
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4",
    },
  },
  defaultVariants: {
    variant: "neutral",
    mode: "stroke",
    size: "md",
  },
});

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Root = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, mode, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={buttonVariants({ variant, mode, size, className })}
        {...props}
      />
    );
  },
);
Root.displayName = "Button";

export { Root, buttonVariants };
export type { ButtonProps };
