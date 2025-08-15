import React, { useRef, useState, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor = "rgba(220, 38, 38, 0.15)"
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0);

  // Throttle mousemove for better performance
  const throttledMouseMove = useCallback(
    (() => {
      let isThrottled = false;
      return (e: React.MouseEvent<HTMLDivElement>) => {
        if (isThrottled || !divRef.current || isFocused) return;
        
        isThrottled = true;
        requestAnimationFrame(() => {
          const rect = divRef.current?.getBoundingClientRect();
          if (rect) {
            setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          }
          isThrottled = false;
        });
      };
    })(),
    [isFocused]
  );

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={throttledMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border border-gray-300 bg-white/90 backdrop-blur-sm overflow-hidden p-8 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
          transform: 'translateZ(0)', // Force hardware acceleration
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard; 