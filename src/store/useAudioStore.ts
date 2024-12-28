import { create } from 'zustand';
import * as Tone from 'tone';
import { Track } from '../types/track';
import { createInitialTracks } from '../utils/trackUtils';

interface AudioStore {
  bpm: number;
  tracks: Track[];
  playing: boolean;
  zoom: number;
  duration: number;
  setBpm: (bpm: number) => void;
  togglePlay: () => void;
  setZoom: (zoom: number) => void;
  setDuration: (duration: number) => void;
  updateTrack: (id: string, updates: Partial<Track>) => void;
  moveTrack: (fromPosition: number, toPosition: number) => void;
  initializeTracks: () => void;
  addTrack: (track: Omit<Track, 'position'>) => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  bpm: 120,
  tracks: [],
  playing: false,
  zoom: 1,
  duration: 60,

  setBpm: (bpm) => {
    Tone.Transport.bpm.value = bpm;
    set({ bpm });
  },

  togglePlay: () => {
    const { playing } = get();
    if (!playing) {
      Tone.Transport.start();
    } else {
      Tone.Transport.pause();
    }
    set({ playing: !playing });
  },

  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(10, zoom)) }),
  
  setDuration: (duration) => set({ duration }),

  updateTrack: (id, updates) => {
    const { tracks } = get();
    set({
      tracks: tracks.map(track =>
        track.id === id ? { ...track, ...updates } : track
      )
    });
  },

  moveTrack: (fromPosition, toPosition) => {
    const { tracks } = get();
    const newTracks = [...tracks];
    const [movedTrack] = newTracks.splice(fromPosition, 1);
    newTracks.splice(toPosition, 0, movedTrack);
    
    // Update positions after move
    const updatedTracks = newTracks.map((track, index) => ({
      ...track,
      position: index
    }));
    
    set({ tracks: updatedTracks });
  },

  initializeTracks: () => {
    set({ tracks: createInitialTracks() });
  },

  addTrack: (track) => {
    const { tracks } = get();
    set({
      tracks: [...tracks, { ...track, position: tracks.length }]
    });
  }
}));