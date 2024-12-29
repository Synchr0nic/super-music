import React from 'react';
import { useAudioStore } from '../store/useAudioStore';

export const Grid: React.FC = () => {
  const { zoom, duration, bpm } = useAudioStore();
  
  const subGridLines = React.useMemo(() => {
    const spacing = 65 * zoom;
    const beatsPerSecond = bpm / 60;
    const numberOfLines = Math.ceil(duration * beatsPerSecond * 4);
    return Array.from({ length: numberOfLines }, (_, i) => ({
      position: i * (spacing / 4)
    }));
  }, [zoom, duration, bpm]);

  // Generate horizontal lines every 65px (track height)
  const horizontalLines = React.useMemo(() => {
    const trackHeight = 65;
    const numberOfLines = Math.ceil(window.innerHeight / trackHeight);
    return Array.from({ length: numberOfLines }, (_, i) => ({
      position: i * trackHeight
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none ml-[200px]">
      {/* Vertical grid lines */}
      {subGridLines.map(({ position }, index) => (
        <div
          key={`v-${index}`}
          className="absolute top-0 h-full border-l border-gray-500/20"
          style={{ left: position }}
        />
      ))}

      {/* Horizontal grid lines */}
      {horizontalLines.map(({ position }, index) => (
        <div
          key={`h-${index}`}
          className="absolute left-0 w-full border-t border-gray-500/20"
          style={{ top: position }}
        />
      ))}
    </div>
  );
};