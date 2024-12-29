import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

export const useWaveform = (audioBuffer: AudioBuffer | null, zoom: number) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (waveformRef.current && audioBuffer) {
      // Create WaveSurfer instance
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4f46e5',
        progressColor: '#818cf8',
        cursorColor: '#ffffff',
        barWidth: 2,
        barGap: 1,
        height: 65 - 23,
        normalize: true,
        interact: true, // Enable interaction
      });

      // Convert AudioBuffer to Blob
      const numberOfChannels = audioBuffer.numberOfChannels;
      const length = audioBuffer.length;
      const sampleRate = audioBuffer.sampleRate;
      const offlineContext = new OfflineAudioContext(numberOfChannels, length, sampleRate);
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineContext.destination);
      source.start();

      offlineContext.startRendering().then((renderedBuffer) => {
        const wavBlob = audioBufferToWav(renderedBuffer);
        wavesurfer.current?.loadBlob(wavBlob);
        wavesurfer.current?.on('ready', () => {
          setIsReady(true);
        });
      });
    }

    return () => {
      wavesurfer.current?.destroy();
      setIsReady(false);
    };
  }, [audioBuffer]);

  useEffect(() => {
    if (isReady && wavesurfer.current) {
      wavesurfer.current.zoom(zoom * 50);
    }
  }, [zoom, isReady]);

  const playAudio = () => {
    wavesurfer.current?.play();
  };

  const pauseAudio = () => {
    wavesurfer.current?.pause();
  };

  return { waveformRef, playAudio, pauseAudio, wavesurfer: wavesurfer.current };
};

// Convert AudioBuffer to WAV format
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numberOfChannels = buffer.numberOfChannels;
  const length = buffer.length * numberOfChannels * 2;
  const arrayBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(arrayBuffer);

  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * numberOfChannels * 2, true);
  view.setUint16(32, numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);

  // Write audio data
  const offset = 44;
  const channels = [];
  for (let i = 0; i < numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      view.setInt16(offset + (i * numberOfChannels + channel) * 2, sample * 0x7fff, true);
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}