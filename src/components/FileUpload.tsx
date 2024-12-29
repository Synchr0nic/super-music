import React, { useCallback, useEffect, useState } from 'react';
import { useAudioStore } from '../store/useAudioStore';
import { UploadCloud } from 'lucide-react';

export const FileUpload: React.FC = () => {
  const { loadAudioFile } = useAudioStore();
  const [showPopup, setShowPopup] = useState(false);

  const handleDrop = useCallback((files: File[]) => {
    files.forEach(file => loadAudioFile(file, 'burgil'));
    setShowPopup(false);
  }, [loadAudioFile]);

  useEffect(() => {
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      setShowPopup(true);
    };

    const handleDragLeave = (event: DragEvent) => {
      event.preventDefault();
      setShowPopup(false);
    };

    const handleDropEvent = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const files = Array.from(event.dataTransfer?.files || []);
      handleDrop(files);
    };

    document.body.addEventListener('dragover', handleDragOver);
    document.body.addEventListener('dragleave', handleDragLeave);
    document.body.addEventListener('drop', handleDropEvent);

    return () => {
      document.body.removeEventListener('dragover', handleDragOver);
      document.body.removeEventListener('dragleave', handleDragLeave);
      document.body.removeEventListener('drop', handleDropEvent);
    };
  }, [handleDrop]);

  if (!showPopup) return null;

  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-gray-800 p-8 rounded shadow-lg text-center text-white">
        <UploadCloud size={48} className="mx-auto mb-4" />
        <p className="text-lg font-semibold">Release the files to add them</p>
      </div>
    </div>
  );
};