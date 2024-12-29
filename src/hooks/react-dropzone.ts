import { useState, useCallback } from 'react';

interface DropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
}

export const useDropzone = ({ onDrop }: DropzoneProps) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragActive(false);
    const files = Array.from(event.dataTransfer.files);
    onDrop(files);
  }, [onDrop]);

  const getRootProps = () => ({
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  });

  const getInputProps = () => ({
    type: 'file',
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      onDrop(files);
    },
  });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
  };
};
