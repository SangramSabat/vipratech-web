import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

/**
 * Radix Tabs, styled to brand tokens.
 *
 * Replaces `<button aria-pressed>` groups, which announced as toggle buttons
 * rather than tabs and had no arrow-key navigation — spec S7.2. Radix supplies
 * tablist/tab/tabpanel roles plus roving tabindex and Home/End support.
 */
export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      // Wraps rather than scrolling once there is room for a second row: the
      // five offers overflowed a single row at desktop widths, hiding the last
      // one behind a scroll with no affordance while the heading counted five.
      className={cn("flex gap-2 overflow-x-auto pb-4 sm:flex-wrap sm:overflow-visible", className)}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 py-3 font-mono text-xs font-bold whitespace-nowrap transition-colors",
        "border border-hairline bg-surface/80 text-ink-subtle",
        "hover:bg-surface-raised hover:text-ink",
        // Selected state is brand *border + tint*, not a solid brand fill.
        // S3.1 reserves "solid lime, black text" for the primary CTA tier, and
        // the services section renders a primary CTA inside the active panel —
        // so a filled tab put two identical lime pills in one viewport and the
        // eye could not tell "this is selected" from "this is the action".
        // S12.4's featured-option pattern (brand border + tint) is the treatment
        // the spec already defines for one-of-several, so use that.
        "data-[state=active]:border-brand data-[state=active]:bg-brand/15 data-[state=active]:text-brand",
        className,
      )}
      {...props}
    />
  );
}

/**
 * `forceMount` keeps every panel in the DOM, with Radix marking the inactive
 * ones `hidden`. Without it only the active panel is rendered, so four of the
 * five service panels — and the links through to their pages — were absent
 * from the prerendered HTML and invisible to crawlers.
 */
export function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      forceMount
      className={cn("mt-8 data-[state=inactive]:hidden", className)}
      {...props}
    />
  );
}
