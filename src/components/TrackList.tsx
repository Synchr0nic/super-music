import React, { useEffect } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Track } from './Track';
import { Grid } from './Grid';
import { Timeline } from './Timeline';
import { useAudioStore } from '../store/useAudioStore';

export const TrackList: React.FC = () => {
  const { bpm, zoom, duration, tracks, moveTrack, initializeTracks, currentTime } = useAudioStore();

  useEffect(() => {
    // Only initialize if there are no tracks
    if (tracks.length === 0) {
      initializeTracks();
    }
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tracks.findIndex(track => track.id === active.id);
      const newIndex = tracks.findIndex(track => track.id === over.id);
      moveTrack(oldIndex, newIndex);
    }
  };

  return (
    <div className="flex flex-col relative">
      <Timeline />
      <div className="relative min-h-screen">
        <div style={{ 
          width: `${Math.max(duration * zoom * 200, window.innerWidth - 200)}px`,
          minHeight: tracks.length * 65  // Height based on number of tracks
        }}>
          <Grid />
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-red-500/50 z-50"
            style={{ 
              left: `${currentTime * (bpm / 60) * 65 * zoom + 200}px`,
            }}
          />
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={tracks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              {tracks.map((track, index) => (
                <Track key={track.id} index={index} {...track} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};