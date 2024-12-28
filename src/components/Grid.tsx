import React from 'react';
import { useAudioStore } from '../store/useAudioStore';

export const Grid: React.FC = () => {
  const { zoom, duration } = useAudioStore();
  
  return (
    <div 
      className="absolute inset-0 pointer-events-none ml-[180px]"
      style={{ 
        backgroundSize: `${65 * zoom}px 65px`,
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        width: `${duration * zoom * 200}px`
      }}
    />
  );
};