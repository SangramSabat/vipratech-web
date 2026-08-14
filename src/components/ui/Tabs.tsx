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
        "data-[state=active]:border-brand data-[state=active]:bg-brand data-[state=active]:text-black",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn("mt-8", className)} {...props} />;
}
