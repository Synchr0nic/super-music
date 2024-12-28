import React from 'react';
import { Volume2, VolumeX, Mic, GripVertical } from 'lucide-react';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAudioStore } from '../store/useAudioStore';
import { useWaveform } from '../hooks/useWaveform';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';

interface TrackProps {
  id: string;
  index: number;
  name: string;
  audioBuffer: AudioBuffer | null;
  position: number;
  muted: boolean;
  solo: boolean;
  volume: number;
}

export const Track: React.FC<TrackProps> = ({
  id,
  index,
  name,
  audioBuffer,
  muted,
  volume
}) => {
  const { updateTrack, zoom } = useAudioStore();
  const waveformRef = useWaveform(audioBuffer, zoom);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex select-none relative top-[1px]"
    >
      <div className="flex w-[180px] h-[65px] border-b border-[rgba(255,255,255,0.05)] sticky left-[1px] bg-[#111827] border-r">
        <div
          {...attributes}
          {...listeners}
          className="min-w-8 w-8 flex items-center justify-center cursor-grab hover:text-indigo-400"
        >
          <GripVertical size={20} />
        </div>

        <div className="flex-shrink-0 flex items-center space-x-4">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <Mic size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium" style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              width: '85px',
            }}>{name}</h3>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full relative right-[1px]">
        {audioBuffer && <DndContext collisionDetection={closestCenter} onDragEnd={() => { }}>
          <SortableContext items={[id]} strategy={horizontalListSortingStrategy}>
            <div key={id} className="bg-orange-400/10 border-l border-r border-t border-b border-orange-400">
              <div className='bg-orange-400/45 text-sm border-b border-orange-400 pl-2'>
                {name}
              </div>
              <div ref={waveformRef} className="w-full" />
            </div>
          </SortableContext>
        </DndContext>}
      </div>

      <div className="w-48 flex-shrink-0 items-center space-x-4 hidden">
        <button
          onClick={() => updateTrack(id, { muted: !muted })}
          className={`p-2 rounded ${muted ? 'bg-red-500' : 'bg-gray-700'
            } hover:opacity-80 transition-opacity`}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => updateTrack(id, { volume: Number(e.target.value) })}
          className="flex-1"
        />
      </div>
    </div>
  );
};