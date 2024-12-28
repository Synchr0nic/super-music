import { Track } from '../types/track';

export const createEmptyTrack = (position: number): Track => ({
  id: crypto.randomUUID(),
  name: `Track ${position + 1}`,
  audioBuffer: null,
  position,
  muted: false,
  solo: false,
  volume: 1
});

export const createInitialTracks = (count: number = 5): Track[] => {
  return Array.from({ length: count }, (_, i) => createEmptyTrack(i));
};