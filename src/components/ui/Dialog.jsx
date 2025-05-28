import React from 'react';
import * as DialogPrimitive from '@headlessui/react/dialog';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = ({ children, ...props }) => {
  return <DialogPrimitive.Portal {...props}>{children}</DialogPrimitive.Portal>;
};

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-100 ${className || ''}`}
      {...props}
    />
  );
});
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Panel
        ref={ref}
        className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-6 shadow-lg duration-200 sm:rounded-lg ${className || ''}`}
        {...props}
        aria-describedby="dialog-description"
      >
        {children}
        {/* Add a visually hidden description for screen readers */}
        <div id="dialog-description" className="sr-only">
          Dialog content for accessibility purposes
        </div>
      </DialogPrimitive.Panel>
    </DialogPortal>
  );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }) => {
  return (
    <div
      className={`flex flex-col space-y-1.5 text-center sm:text-left ${className || ''}`}
      {...props}
    />
  );
};

const DialogFooter = ({ className, ...props }) => {
  return (
    <div
      className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ''}`}
      {...props}
    />
  );
};

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={`text-lg font-semibold leading-none tracking-tight ${className || ''}`}
      {...props}
    />
  );
});
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={`text-sm text-gray-500 ${className || ''}`}
      {...props}
    />
  );
});
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
};
