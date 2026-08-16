import * as SliderPrimitive from "@radix-ui/react-slider";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

/**
 * Radix Slider, styled to brand tokens.
 *
 * `role="slider"` lives on the Thumb, not the Root, so the accessible name has
 * to be set there: an `aria-label` on the Root (or a `<label for>` pointing at
 * it) leaves the control unnamed in the accessibility tree, since assistive
 * tech does not inherit names from ancestors. Verified against the CDP AX tree
 * rather than the DOM (spec S7.9).
 *
 * The thumb is 44px to satisfy the tap-target minimum (S7.4); the visual dot is
 * drawn smaller inside it so the control still reads as fine.
 */
export function Slider({
  className,
  label,
  ...props
}: ComponentProps<typeof SliderPrimitive.Root> & { label: string }) {
  return (
    <SliderPrimitive.Root
      className={cn("relative flex w-full touch-none select-none items-center py-3", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-surface-raised">
        <SliderPrimitive.Range className="absolute h-full bg-brand" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={label}
        className={cn(
          "grid size-11 place-items-center rounded-full",
          "before:block before:size-5 before:rounded-full before:bg-brand before:shadow-lg before:transition-transform",
          "hover:before:scale-110 focus-visible:before:scale-110",
        )}
      />
    </SliderPrimitive.Root>
  );
}
