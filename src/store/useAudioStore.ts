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
  currentTime: number;
  setBpm: (bpm: number) => void;
  togglePlay: () => void;
  setZoom: (zoom: number) => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
  updateTrack: (id: string, updates: Partial<Track>) => void;
  moveTrack: (fromPosition: number, toPosition: number) => void;
  initializeTracks: () => void;
  addTrack: (track: Omit<Track, 'position'>) => void;
  loadAudioFile: (file: File, contributor: string) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  playTrack: (id: string) => void;
  pauseTrack: (id: string) => void;
}

export const useAudioStore = create<AudioStore>((set, get) => {
  const transport = Tone.getTransport();

  return {
    bpm: 120,
    tracks: [],
    playing: false,
    zoom: 1,
    duration: 60,
    currentTime: 0,

    setBpm: (bpm) => {
      transport.bpm.value = bpm;
      set({ bpm });
    },

    togglePlay: () => {
      const { playing, tracks } = get();
      const transport = Tone.getTransport();
      
      if (!playing) {
        // Clear any existing players
        transport.cancel();
        
        // Create and sync all track players
        tracks.forEach(track => {
          if (track.audioBuffer && !track.muted) {
            const player = new Tone.Player({
              url: track.audioBuffer,
              loop: false,
            }).toDestination();
            
            player.sync().start(0);
          }
        });
        
        // Start transport and update time
        transport.start();
        const intervalId = setInterval(() => {
          set({ currentTime: transport.seconds });
        }, 100);
        set({ playing: true, currentTime: transport.seconds });
        
        // Store interval ID for cleanup
        (window as any).timeUpdateInterval = intervalId;
      } else {
        transport.pause();
        clearInterval((window as any).timeUpdateInterval);
        set({ playing: false });
      }
    },

    setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(10, zoom)) }),
    
    setDuration: (duration) => set({ duration }),

    setCurrentTime: (time) => set({ currentTime: time }),

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
    },

    loadAudioFile: async (file, contributor) => {
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await Tone.getContext().rawContext.decodeAudioData(arrayBuffer);
      const { tracks } = get();
      set({
        tracks: [...tracks, { 
          id: crypto.randomUUID(), 
          name: file.name, 
          audioBuffer,
          position: tracks.length, 
          muted: false, 
          solo: false, 
          volume: 1,
          contributor
        }]
      });
    },

    play: () => {
      transport.start();
      set({ playing: true });
    },

    pause: () => {
      transport.pause();
      set({ playing: false });
    },

    stop: () => {
      transport.stop();
      transport.position = 0;
      clearInterval((window as any).timeUpdateInterval);
      set({ playing: false, currentTime: 0 });
    },

    playTrack: (id) => {
      const { tracks } = get();
      const track = tracks.find(track => track.id === id);
      if (track && track.audioBuffer) {
        const player = new Tone.Player(track.audioBuffer).toDestination();
        player.start();
        set({ playing: true });
      }
    },

    pauseTrack: (id) => {
      // Implementation to pause the track
    }
  };
});