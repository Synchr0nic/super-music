import React, { useEffect, useState, useCallback } from 'react';
import { Play, Pause, StopCircle, ZoomIn, ZoomOut, UploadCloud } from 'lucide-react';
import { useAudioStore } from '../store/useAudioStore';
import * as Tone from 'tone';

export const Transport: React.FC = () => {
  const { bpm, playing, zoom, togglePlay, setBpm, setZoom, stop, loadAudioFile } = useAudioStore();
  const [currentTime, setCurrentTime] = useState(0);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach(file => loadAudioFile(file, 'burgil'));
  }, [loadAudioFile]);

  useEffect(() => {
    let interval: number = 0;
    if (playing) {
      interval = setInterval(() => {
        setCurrentTime(Tone.getTransport().seconds);
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [playing]);

  const handleStop = () => {
    stop();
    setCurrentTime(0);
  };

  return (
    <div className="flex items-center space-x-4 bg-gray-800 p-4 border-b border-gray-700">
      <button
        onClick={togglePlay}
        className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
      >
        {playing ? <Pause size={24} /> : <Play size={24} />}
      </button>
      <button
        onClick={handleStop}
        className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
      >
        <StopCircle size={24} />
      </button>

      <div className="flex items-center space-x-2">
        <label className="text-white">BPM:</label>
        <input
          type="number"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-16 px-2 py-1 bg-gray-700 text-white rounded"
          min="20"
          max="999"
        />
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-white">{currentTime.toFixed(2)}s</span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setZoom(zoom / 1.2)}
          className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <ZoomOut size={20} className="text-white" />
        </button>
        <button
          onClick={() => setZoom(zoom * 1.2)}
          className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <ZoomIn size={20} className="text-white" />
        </button>
      </div>

      <div className="flex-1" />

      <label className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded cursor-pointer transition-colors">
        <UploadCloud size={20} />
        <span>Add Track</span>
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept="audio/*"
          multiple
        />
      </label>
    </div>
  );
};