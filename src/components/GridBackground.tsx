import React from 'react';

type GridPattern = 'square' | 'dots' | 'hexagon' | 'diagonal' | 'circular' | 'wave' | 'diamond';

interface GridBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
  gridSize?: number;
  gridColor?: string;
  opacity?: number;
  strokeWidth?: number;
  pattern?: GridPattern;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  showBorder?: boolean;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  className = '',
  style = {},
  gridSize = 100,
  gridColor = '#dc2626',
  opacity = 0.2,
  strokeWidth = 1,
  pattern = 'diagonal',
  borderWidth = 12,
  borderRadius = 20,
  showBorder = true,
}) => {
  // Encode the grid color for URL
  const encodedColor = encodeURIComponent(gridColor);
  
  // Generate different patterns
  const generatePattern = (patternType: GridPattern): string => {
    const size = gridSize;
    const halfSize = size / 2;
    const quarterSize = size / 4;
    
    switch (patternType) {
      case 'dots':
        return `%3Csvg width='${size}' height='${size}' viewBox='0 0 ${size} ${size}' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodedColor}' opacity='${opacity}'%3E%3Ccircle cx='${halfSize}' cy='${halfSize}' r='${strokeWidth * 2}'/%3E%3Ccircle cx='0' cy='0' r='${strokeWidth}'/%3E%3Ccircle cx='${size}' cy='0' r='${strokeWidth}'/%3E%3Ccircle cx='0' cy='${size}' r='${strokeWidth}'/%3E%3Ccircle cx='${size}' cy='${size}' r='${strokeWidth}'/%3E%3C/g%3E%3C/svg%3E`;
      
      case 'hexagon':
        return `%3Csvg width='${size}' height='${size}' viewBox='0 0 ${size} ${size}' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${encodedColor}' stroke-width='${strokeWidth}' opacity='${opacity}'%3E%3Cpath d='M${halfSize} 0 L${size * 0.75} ${quarterSize} L${size * 0.75} ${size * 0.75} L${halfSize} ${size} L${quarterSize} ${size * 0.75} L${quarterSize} ${quarterSize} Z'/%3E%3C/g%3E%3C/svg%3E`;
      
      case 'diagonal':
        return `%3Csvg width='${size}' height='${size}' viewBox='0 0 ${size} ${size}' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${encodedColor}' stroke-width='${strokeWidth}' opacity='${opacity}'%3E%3Cpath d='M0 0 L${size} ${size} M${size} 0 L0 ${size}'/%3E%3Cpath d='M0 ${halfSize} L${size} ${halfSize} M${halfSize} 0 L${halfSize} ${size}'/%3E%3C/g%3E%3C/svg%3E`;
      
      case 'circular':
        return `%3Csvg width='${size}' height='${size}' viewBox='0 0 ${size} ${size}' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${encodedColor}' stroke-width='${strokeWidth}' opacity='${opacity}'%3E%3Ccircle cx='${halfSize}' cy='${halfSize}' r='${quarterSize}'/%3E%3Ccircle cx='${halfSize}' cy='${halfSize}' r='${halfSize * 0.3}'/%3E%3Cpath d='M${halfSize} 0 L${halfSize} ${size} M0 ${halfSize} L${size} ${halfSize}'/%3E%3C/g%3E%3C/svg%3E`;
      
      case 'wave':
        return `%3Csvg width='${size}' height='${size}' viewBox='0 0 ${size} ${size}' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${encodedColor}' stroke-width='${strokeWidth}' opacity='${opacity}'%3E%3Cpath d='M0 ${halfSize} Q${quarterSize} ${quarterSize} ${halfSize} ${halfSize} T${size} ${halfSize}'/%3E%3Cpath d='M0 ${halfSize} Q${quarterSize} ${size * 0.75} ${halfSize} ${halfSize} T${size} ${halfSize}'/%3E%3Cpath d='M0 0 L${size} 0 M0 ${size} L${size} ${size}'/%3E%3C/g%3E%3C/svg%3E`;
      
      case 'diamond':
        return `%3Csvg width='${size}' height='${size}' viewBox='0 0 ${size} ${size}' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${encodedColor}' stroke-width='${strokeWidth}' opacity='${opacity}'%3E%3Cpath d='M${halfSize} 0 L${size} ${halfSize} L${halfSize} ${size} L0 ${halfSize} Z'/%3E%3Cpath d='M0 0 L${size} ${size} M${size} 0 L0 ${size}'/%3E%3C/g%3E%3C/svg%3E`;
      
      default: // square
        return `%3Csvg width='${size}' height='${size}' viewBox='0 0 ${size} ${size}' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${encodedColor}' stroke-width='${strokeWidth}' opacity='${opacity}'%3E%3Cpath d='M0 0h${size}v${size}H0z'/%3E%3Cpath d='M0 0v${size}M${size} 0v${size}'/%3E%3Cpath d='M0 0h${size}M0 ${size}h${size}'/%3E%3C/g%3E%3C/svg%3E`;
    }
  };
  
  // Create the SVG grid pattern
  const gridSvg = `data:image/svg+xml,${generatePattern(pattern)}`;

  // Create metallic effect with layered box shadows
  const metallicBorder = showBorder 
    ? `inset 0 0 0 ${borderWidth}px #c92a2a, inset 0 0 0 ${borderWidth - 2}px #ff6b6b, inset 0 0 0 ${borderWidth - 4}px #ee5a6f, inset 0 0 0 ${borderWidth - 6}px #a61e1e, inset 0 0 0 ${borderWidth - 8}px #8b1818`
    : 'none';

  return (
    <div
      className={`grid-background ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `url("${gridSvg}")`,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        pointerEvents: 'none',
        ...(showBorder && {
          boxShadow: metallicBorder,
          borderRadius: `${borderRadius}px`,
        }),
        ...style,
      }}
    />
  );
};

export default GridBackground;
