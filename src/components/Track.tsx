import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, GripVertical } from 'lucide-react';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAudioStore } from '../store/useAudioStore';
import { useWaveform } from '../hooks/useWaveform';
import { DndContext, closestCenter, useDraggable } from '@dnd-kit/core';

interface TrackProps {
  id: string;
  index: number;
  name: string;
  audioBuffer: AudioBuffer | null;
  position: number;
  muted: boolean;
  solo: boolean;
  volume: number;
  contributor: string;
}

export const Track: React.FC<TrackProps> = ({
  id,
  index,
  name,
  audioBuffer,
  muted,
  volume,
  contributor
}) => {
  const { updateTrack, zoom } = useAudioStore();
  const { waveformRef, playAudio, pauseAudio, wavesurfer } = useWaveform(audioBuffer, zoom);
  const [showVolumeTooltip, setShowVolumeTooltip] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const {
    attributes: dragAttributes,
    listeners: dragListeners,
    setNodeRef: setDragNodeRef,
    transform: dragTransform,
  } = useDraggable({ id: `waveform-${id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const dragStyle = {
    transform: CSS.Transform.toString(dragTransform),
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.on('finish', () => {
        setIsPlaying(false);
      });
    }
  }, [wavesurfer]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex select-none relative top-[1px]"
    >
      {/* Track Controls */}
      <div className="flex w-[200px] h-[65px] border-b border-[rgba(255,255,255,0.05)] sticky left-[1px] bg-[#111827] border-r z-10">
        <div
          {...attributes}
          {...listeners}
          className="min-w-8 w-8 flex items-center justify-center cursor-grab hover:text-indigo-400"
        >
          <GripVertical size={20} />
        </div>

        <div className="flex-shrink-0 flex items-center space-x-4">
          <button
            onClick={handlePlayPause}
            className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center"
          >
            {isPlaying ? <Pause size={16} className="text-white" /> : <Play size={16} className="text-white" />}
          </button>
          
          {/* Volume Control */}
          <div
            className="relative"
            style={{ zIndex: showVolumeTooltip ? 50 : 'auto' }}
            onMouseEnter={() => setShowVolumeTooltip(true)}
            onMouseLeave={() => setShowVolumeTooltip(false)}
          >
            <button
              onClick={() => updateTrack(id, { muted: !muted })}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${muted ? 'bg-red-500' : 'bg-gray-700'} hover:opacity-80 transition-opacity`}
            >
              {muted ? <VolumeX size={16} className="text-white" /> : <Volume2 size={16} className="text-white" />}
            </button>
            {showVolumeTooltip && (
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded p-1 shadow-lg">
                {Math.round(volume * 100)}%
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => updateTrack(id, { volume: Number(e.target.value) })}
                  className="w-full mt-1"
                />
              </div>
            )}
          </div>

          {/* Track Info */}
          <div>
            <h3 
              className="text-white font-medium truncate max-w-[85px]" 
              title={name}
            >
              {name}
            </h3>
            <p className="text-xs text-gray-400 truncate max-w-[85px]" title={contributor}>
              {contributor}
            </p>
          </div>
        </div>
      </div>

      {/* Waveform Area */}
      <div className="flex-1 w-full relative right-[1px]">
        {audioBuffer && (
          <DndContext collisionDetection={closestCenter} onDragEnd={() => { }}>
            <SortableContext items={[id]} strategy={horizontalListSortingStrategy}>
              <div
                key={id}
                ref={setDragNodeRef}
                style={{
                  ...dragStyle,
                  width: `${audioBuffer.duration * zoom * 100}px`
                }}
                {...dragAttributes}
                {...dragListeners}
                className="bg-orange-400/10 border-l border-r border-t border-b border-orange-400 w-fit"
              >
                <div className='bg-orange-400/45 text-sm border-b border-orange-400 pl-2 truncate' title={name}>
                  {name}
                </div>
                <div ref={waveformRef} className="w-full" />
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};