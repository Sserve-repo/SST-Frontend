"use client";

import * as React from "react";
import ReactModal from "react-modal";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Set app element for accessibility
if (typeof window !== "undefined") {
  ReactModal.setAppElement("body");
}

// Context for managing dialog state
interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | null>(null);

const useDialogContext = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog");
  }
  return context;
};

// Dialog Root Component
interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({
  open = false,
  onOpenChange,
  children,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(newOpen);
      } else {
        setInternalOpen(newOpen);
      }
    },
    [isControlled, onOpenChange]
  );

  return (
    <DialogContext.Provider
      value={{ open: isOpen, onOpenChange: handleOpenChange }}
    >
      {children}
    </DialogContext.Provider>
  );
};

// Dialog Trigger Component
interface DialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const DialogTrigger: React.FC<DialogTriggerProps> = ({
  asChild,
  children,
  onClick,
}) => {
  const { onOpenChange } = useDialogContext();

  const handleClick = () => {
    onClick?.();
    onOpenChange(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      onClick: handleClick,
    });
  }

  return (
    <button onClick={handleClick} type="button">
      {children}
    </button>
  );
};

// Dialog Portal (not needed with React Modal, but kept for API compatibility)
const DialogPortal: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

// Dialog Close Component
interface DialogCloseProps {
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const DialogClose: React.FC<DialogCloseProps> = ({
  asChild,
  children,
  className,
}) => {
  const { onOpenChange } = useDialogContext();

  const handleClick = () => {
    onOpenChange(false);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      onClick: handleClick,
    });
  }

  return (
    <button onClick={handleClick} className={className} type="button">
      {children}
    </button>
  );
};

// Dialog Overlay (handled by React Modal)
const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  console.log(props, ref, className)
  // This is handled by React Modal's overlay, but kept for API compatibility
  return null;
});
DialogOverlay.displayName = "DialogOverlay";

// Dialog Content Component
interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
  hideCloseButton?: boolean;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onInteractOutside?: (event: Event) => void;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (
    {
      // className,
      children,
      hideCloseButton = false,
      onOpenAutoFocus,
      onCloseAutoFocus,
      // onEscapeKeyDown,
      // onPointerDownOutside,
      // onInteractOutside,
      ...props
    },
    ref
  ) => {
    const { open, onOpenChange } = useDialogContext();
    
    // Lock body scroll when modal is open
    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
      };
    }, [open]);

    const handleRequestClose = () => {
      onOpenChange(false);
    };

    const handleAfterOpen = () => {
      if (onOpenAutoFocus) {
        const event = new Event("focus");
        onOpenAutoFocus(event);
      }
    };

    const handleAfterClose = () => {
      if (onCloseAutoFocus) {
        const event = new Event("focus");
        onCloseAutoFocus(event);
      }
    };

    return (
      <ReactModal
        isOpen={open}
        onRequestClose={handleRequestClose}
        onAfterOpen={handleAfterOpen}
        onAfterClose={handleAfterClose}
        closeTimeoutMS={200}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        contentLabel="Dialog"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          },
          content: {
            position: "relative",
            top: "auto",
            left: "auto",
            right: "auto",
            bottom: "auto",
            border: "1px solid #ccc",
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "1.5rem",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
          },
        }}
      >
        <div ref={ref} {...props}>
          {children}
          {!hideCloseButton && (
            <button
              onClick={() => onOpenChange(false)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </ReactModal>
    );
  }
);

DialogContent.displayName = "DialogContent";

// Dialog Header Component
const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
));
DialogHeader.displayName = "DialogHeader";

// Dialog Footer Component
const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
));
DialogFooter.displayName = "DialogFooter";

// Dialog Title Component
const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

// Dialog Description Component
const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
