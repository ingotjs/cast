import { X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { AuthForm } from "./auth-form";

type AuthModalContextValue = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const AuthModalContext = createContext<AuthModalContextValue>({
  open: () => {},
  close: () => {},
  isOpen: false,
});

export const useAuthModal = () => useContext(AuthModalContext);

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <AuthModalContext value={{ open, close, isOpen }}>
      {children}
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- Backdrop click to close */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
            <div
              className="relative w-full max-w-[25rem] animate-in fade-in zoom-in-95 duration-200"
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                onClick={close}
                className="absolute -top-2 -right-2 z-10 rounded-full bg-card p-1.5 text-muted-foreground shadow-md transition hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
              <AuthForm onSuccess={close} />
            </div>
          </div>,
          document.body
        )}
    </AuthModalContext>
  );
};
