import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useAudioStore } from '../store/useAudioStore';

export const FileUpload: React.FC = () => {
  const { addTrack } = useAudioStore();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      addTrack({
        id: crypto.randomUUID(),
        name: file.name,
        audioBuffer,
        muted: false,
        solo: false,
        volume: 1
      });
    } catch (error) {
      console.error('Error loading audio file:', error);
    }
  }, [addTrack]);

  return (
    <div className="p-4 border-t border-gray-700">
      <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-500 transition-colors">
        <div className="flex flex-col items-center space-y-2">
          <Upload size={24} className="text-gray-400" />
          <span className="text-sm text-gray-400">Drop audio files here or click to upload</span>
        </div>
        <input
          type="file"
          className="hidden"
          accept="audio/*"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
};