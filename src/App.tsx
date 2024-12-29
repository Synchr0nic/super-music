import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import { Transport } from './components/Transport';
import { TrackList } from './components/TrackList';
import { FileUpload } from './components/FileUpload';
import { Modal } from './components/Modal';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

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
      
      <Modal isOpen={showWelcome} onClose={() => setShowWelcome(false)}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Super Music!</h2>
          <p className="text-gray-300 mb-6">
            Get ready to create amazing music. Upload your tracks and start mixing!
          </p>
          <button
            onClick={() => setShowWelcome(false)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
          >
            Let's Get Started
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default App;