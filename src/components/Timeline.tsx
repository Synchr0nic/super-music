import React, { useEffect, useState } from 'react';
import { useAudioStore } from '../store/useAudioStore';
import * as Tone from 'tone';

const Playhead: React.FC<{ currentTime: number, bpm: number, zoom: number }> = ({ currentTime, bpm, zoom }) => {
  return (
    <div
      className="absolute top-0 bottom-0 w-1 bg-red-500 z-50"
      style={{ 
        left: `${currentTime * (bpm / 60) * 65 * zoom + 200}px`,
        height: '100%'
      }}
    />
  );
};

export const Timeline: React.FC = () => {
  const { zoom, duration, bpm, playing } = useAudioStore();
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let interval: number = 0;
    if (playing) {
      interval = setInterval(() => {
        setCurrentTime(Tone.Transport.seconds);
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [playing]);

  const gridLines = React.useMemo(() => {
    const spacing = 65 * zoom; // Base grid spacing in pixels
    const beatsPerSecond = bpm / 60;
    const numberOfLines = Math.ceil(duration * beatsPerSecond); // Lines per beat
    return Array.from({ length: numberOfLines }, (_, i) => ({
      position: i * spacing,
      beat: i + 1 // Beat number
    }));
  }, [zoom, duration, bpm]);

  return (
    <div className="h-8 bg-gray-800 border-b border-gray-700 relative">
      <div 
        className="absolute ml-[200px] top-0 left-0 h-full" 
        style={{ 
          width: `${Math.max(duration * zoom * 200, window.innerWidth - 200)}px`
        }}
      >
        {gridLines.map(({ position, beat }) => (
          <div
            key={position}
            className="absolute top-0 h-full border-l border-gray-600"
            style={{ left: position, width: 64 * zoom }}
          >
            <span className="text-xs text-gray-400 ml-1 absolute left-1/2 transform -translate-x-1/2">
              {beat}
            </span>
          </div>
        ))}
        <Playhead currentTime={currentTime} bpm={bpm} zoom={zoom} />
      </div>
    </div>
  );
};