// AlignUI DotStepper v0.0.0

"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { tv, type VariantProps } from "@/utils/tv";

export const dotStepperVariants = tv({
  slots: {
    root: "flex flex-wrap",
    item: [
      "shrink-0 cursor-pointer rounded-full bg-bg-soft-200 outline-none transition duration-200 ease-out",
      "focus:outline-none",
      // A ring, not AlignUI's fill: the fill matched the active dot, so a
      // focused dot read as a second selected one.
      "focus-visible:ring-1 focus-visible:ring-stroke-strong-950 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-white-0",
    ],
  },
  variants: {
    size: {
      small: { root: "gap-2.5", item: "size-2" },
      xsmall: { root: "gap-1.5", item: "size-1" },
    },
  },
  defaultVariants: {
    size: "small",
  },
});

type DotStepperSharedProps = VariantProps<typeof dotStepperVariants>;

const DotStepperContext = React.createContext<DotStepperSharedProps>({});

type DotStepperRootProps = React.HTMLAttributes<HTMLDivElement> &
  DotStepperSharedProps & { asChild?: boolean };

function DotStepperRoot({ asChild, children, size, className, ...rest }: DotStepperRootProps) {
  const Component = asChild ? Slot : "div";
  const { root } = dotStepperVariants({ size });
  return (
    <DotStepperContext.Provider value={{ size }}>
      <Component className={root({ class: className })} {...rest}>
        {children}
      </Component>
    </DotStepperContext.Provider>
  );
}
DotStepperRoot.displayName = "DotStepperRoot";

type DotStepperItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  active?: boolean;
};

const DotStepperItem = React.forwardRef<HTMLButtonElement, DotStepperItemProps>(
  ({ asChild, className, active, ...rest }, forwardedRef) => {
    const { size } = React.useContext(DotStepperContext);
    const Component = asChild ? Slot : "button";
    const { item } = dotStepperVariants({ size });
    return (
      <Component
        ref={forwardedRef}
        // The site is neutral, so the active dot takes the strong text
        // colour rather than AlignUI's blue primary.
        className={item({ class: [active && "bg-text-strong-950", className] })}
        {...rest}
      />
    );
  },
);
DotStepperItem.displayName = "DotStepperItem";

export { DotStepperRoot as Root, DotStepperItem as Item };
