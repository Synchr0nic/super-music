import React, { useEffect } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Track } from './Track';
import { Grid } from './Grid';
import { Timeline } from './Timeline';
import { useAudioStore } from '../store/useAudioStore';

export const TrackList: React.FC = () => {
  const { tracks, moveTrack, initializeTracks } = useAudioStore();

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
    <div className="flex-1 overflow-hidden">
      <Timeline />
      <div className="relative flex-1 overflow-auto min-h-screen">
        <Grid />
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tracks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tracks.map((track, index) => (
              <Track key={track.id} index={index} {...track} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};