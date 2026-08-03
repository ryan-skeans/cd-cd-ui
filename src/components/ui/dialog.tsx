import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ children, className, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-brand-olive/50 backdrop-blur-sm" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-brand-gray/30 bg-white p-6 shadow-2xl focus:outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;
