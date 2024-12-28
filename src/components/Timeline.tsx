import React from 'react';
import { useAudioStore } from '../store/useAudioStore';

export const Timeline: React.FC = () => {
  const { zoom, duration } = useAudioStore();
  
  const gridLines = React.useMemo(() => {
    const spacing = 65 * zoom; // Base grid spacing in pixels
    const numberOfLines = Math.ceil(duration * 4); // 4 lines per second
    return Array.from({ length: numberOfLines }, (_, i) => ({
      position: i * spacing,
      time: i * 0.25 // Quarter second intervals
    }));
  }, [zoom, duration]);

  return (
    <div className="h-8 bg-gray-800 border-b border-gray-700 relative overflow-hidden">
      <div className="absolute ml-[180px] top-0 left-0 h-full" style={{ width: `${duration * zoom * 200}px` }}>
        {gridLines.map(({ position, time }) => (
          <div
            key={position}
            className="absolute top-0 h-full border-l border-gray-600"
            style={{ left: position, width: 64 * zoom }}
          >
            <span className="text-xs text-gray-400 ml-1">
              {time.toFixed(2)}s
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};