import React, { useEffect, useRef } from 'react';
import frameMask from '../assets/Frame143.svg';
import './FlashScreen.css';

const FlashScreen: React.FC = () => {
  const rectRef = useRef<HTMLDivElement>(null);

  // Add debugging
  useEffect(() => {
    console.log('FlashScreen component mounted');
    console.log('frameMask URL:', frameMask);
    return () => console.log('FlashScreen component unmounting');
  }, []);

  useEffect(() => {
    const rect = rectRef.current;
    if (!rect) return;
    let animationFrame: number;
    let start: number | null = null;
    const duration = 2000; // ms
    const screenWidth = window.innerWidth;
    const rectWidth = 100;

    function animate(timestamp: number) {
      if (!rect) return; // Fix: check null inside animation frame
      if (!start) start = timestamp;
      const elapsed = (timestamp - start) % duration;
      const progress = elapsed / duration;
      const left = progress * (screenWidth + rectWidth) - rectWidth;
      rect.style.left = `${left}px`;
      animationFrame = requestAnimationFrame(animate);
    }
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="flash-screen__container">
      {/* Add a visible fallback element */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        zIndex: 10000
      }}>
        Loading...
      </div>
      <div
        className="flash-screen__moving-rect"
        ref={rectRef}
        style={{ WebkitMaskImage: `url(${frameMask})`, maskImage: `url(${frameMask})` }}
      />
    </div>
  );
};

export default FlashScreen;
