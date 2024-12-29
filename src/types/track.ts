export interface Track {
  id: string;
  name: string;
  audioBuffer: AudioBuffer | null;
  position: number;
  muted: boolean;
  solo: boolean;
  volume: number;
  contributor: string; // New property
}