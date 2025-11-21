import { useRef } from "react";

export function useSwipeToggle(setOpen: (open: boolean) => void, threshold = 50) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
  };

  const onTouchEnd = () => {
    const distance = touchEndX.current - touchStartX.current;
    if (Math.abs(distance) < threshold) return;

    // Swipe right → open chat list, swipe left → close
    if (distance > 0) setOpen(true);
    else setOpen(false);
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
