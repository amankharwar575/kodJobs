import React, { useState, useEffect } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isFooter, setIsFooter] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if cursor is over footer
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        let parent = element;
        while (parent && parent !== document.body) {
          if (parent.tagName.toLowerCase() === 'footer') {
            setIsFooter(true);
            return;
          }
          parent = parent.parentElement as HTMLElement;
        }
        setIsFooter(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updateCursorPosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const cursorStyle = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: isClicking ? 'scale(0.8)' : 'scale(1)',
  };

  return (
    <div 
      className={`custom-cursor ${isFooter ? 'footer' : 'default'}`} 
      style={cursorStyle}
    />
  );
};

export default CustomCursor; 