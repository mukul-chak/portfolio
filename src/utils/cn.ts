import clsx, { type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

export { type ClassValue } from "clsx";

/**
 * tailwind-merge config. Empty extend for now — AlignUI's custom utility class
 * groups (text scale, shadows, radii) can be registered here if class-merge
 * conflicts show up. On Tailwind v4 those tokens live in globals.css @theme,
 * not a tailwind.config, so this does not import one (unlike AlignUI's v3 util).
 */
export const twMergeConfig = {
  extend: {
    classGroups: {},
  },
};

const customTwMerge = extendTailwindMerge(twMergeConfig);

/** clsx + tailwind-merge — use when classes might conflict. */
export function cn(...classes: ClassValue[]) {
  return customTwMerge(clsx(...classes));
}
