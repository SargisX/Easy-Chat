import React from "react";

export const IgnoreSwipe: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  const stop = (e: React.TouchEvent) => {
    e.stopPropagation(); // prevents swipe hook from receiving this event
  };

  return (
    <div
      {...props}
      onTouchStart={stop}
      onTouchMove={stop}
      onTouchEnd={stop}
    >
      {children}
    </div>
  );
};
