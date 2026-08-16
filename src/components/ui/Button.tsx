import type { ComponentProps, ElementType } from "react";
import { cn } from "../../lib/utils";

/**
 * The three CTA tiers from docs/05-ui-ux-spec.md S3.1.
 *
 * Defining them once is the mechanism that enforces "at most one primary per
 * viewport": previously every call to action rendered the same lime pill, so
 * nothing read as primary.
 */
const VARIANTS = {
  // cta-trace is the page's one flourish and rides the primary tier precisely
  // because the spec already caps that at one per section (S3.1, S6.6).
  primary:
    "cta-trace bg-brand text-black font-bold shadow-lg shadow-brand/20 hover:bg-brand-hover active:translate-y-px",
  secondary:
    "border border-hairline-strong bg-transparent text-ink font-semibold hover:border-brand/60 hover:bg-surface",
  tertiary:
    "text-brand font-semibold underline-offset-4 hover:underline px-0 min-h-0 shadow-none",
} as const;

const SIZES = {
  // min-h-12 / min-h-11 keep every target above the 44px floor (spec S7.4)
  lg: "min-h-12 px-7 text-base gap-2.5",
  md: "min-h-11 px-5 text-sm gap-2",
} as const;

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
} & Omit<ComponentProps<T>, "as">;

export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps<T>) {
  const Component = (as ?? "button") as ElementType;
  return (
    <Component
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-xl transition-colors",
        "disabled:pointer-events-none disabled:opacity-40",
        VARIANTS[variant],
        variant !== "tertiary" && SIZES[size],
        className,
      )}
      {...props}
    />
  );
}
