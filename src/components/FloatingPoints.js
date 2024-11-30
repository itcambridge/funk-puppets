import React, { useEffect } from 'react';

function FloatingPoints({ points, onAnimationComplete, position }) {
  const style = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: 'translate(-50%, 0)' // Center horizontally
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 1000); // Remove after animation completes

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div 
      className="floating-points" 
      style={style}
      data-points={points}
    >
      +{points}
    </div>
  );
}

export default FloatingPoints; 