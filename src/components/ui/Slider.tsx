import * as SliderPrimitive from "@radix-ui/react-slider";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

/**
 * Radix Slider, styled to brand tokens.
 *
 * The thumb is 44px to satisfy the tap-target minimum (spec S7.4); the visual
 * dot is drawn smaller inside it via a ring so the control still reads as fine.
 */
export function Slider({ className, ...props }: ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn("relative flex w-full touch-none select-none items-center py-3", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-surface-raised">
        <SliderPrimitive.Range className="absolute h-full bg-brand" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "grid size-11 place-items-center rounded-full",
          "before:block before:size-5 before:rounded-full before:bg-brand before:shadow-lg before:transition-transform",
          "hover:before:scale-110 focus-visible:before:scale-110",
        )}
      />
    </SliderPrimitive.Root>
  );
}
