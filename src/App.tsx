import React, { useEffect } from 'react';
import * as Tone from 'tone';
import { Transport } from './components/Transport';
import { TrackList } from './components/TrackList';
import { FileUpload } from './components/FileUpload';

function App() {
  useEffect(() => {
    Tone.start();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Transport />
      <div className="flex-1 overflow-auto">
        <div className="inline-block min-w-full">
          <TrackList />
        </div>
      </div>
      <FileUpload />
    </div>
  );
}

export default App;