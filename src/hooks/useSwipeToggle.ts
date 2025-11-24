import { useRef } from "react";

export interface ChatListToggleOptions {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  threshold?: number;
}

export function useSwipeToggle({
  isOpen,
  setOpen,
  threshold = 50,
}: ChatListToggleOptions) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const open = () => setOpen(true);
  const close = () => setOpen(false);
  const toggle = () => setOpen(!isOpen);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
    touchEndX.current = touchStartX.current;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
  };

  const onTouchEnd = () => {
    const distance = touchEndX.current - touchStartX.current;

    if (Math.abs(distance) < threshold) return;

    // LEFT → RIGHT (open)
    if (!isOpen && distance > 0) {
      open();
      return;
    }

    // RIGHT → LEFT (close)
    if (isOpen && distance < 0) {
      close();
      return;
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    open,
    close,
    toggle,
  };
}





