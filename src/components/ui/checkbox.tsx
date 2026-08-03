"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
            "group flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-brand-olive/45 bg-white text-white transition-colors",
            "hover:border-brand-olive hover:bg-brand-offWhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-olive focus-visible:ring-offset-2",
            "data-[state=checked]:border-brand-olive data-[state=checked]:bg-brand-olive data-[state=indeterminate]:border-brand-olive data-[state=indeterminate]:bg-brand-olive",
            "disabled:cursor-not-allowed disabled:border-brand-olive disabled:bg-brand-olive disabled:text-white",
            className,
        )}
        {...props}
    >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center">
            <Check className="hidden h-4 w-4 group-data-[state=checked]:block" aria-hidden="true" />
            <Minus className="hidden h-4 w-4 group-data-[state=indeterminate]:block" aria-hidden="true" />
        </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
