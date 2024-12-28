import React from 'react';
import { Play, Pause, ZoomIn, ZoomOut } from 'lucide-react';
import { useAudioStore } from '../store/useAudioStore';

export const Transport: React.FC = () => {
  const { bpm, playing, zoom, togglePlay, setBpm, setZoom } = useAudioStore();

  return (
    <div className="flex items-center space-x-4 bg-gray-800 p-4 border-b border-gray-700">
      <button
        onClick={togglePlay}
        className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
      >
        {playing ? <Pause size={24} /> : <Play size={24} />}
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
    </div>
  );
};