import React, { useState } from 'react';
import BandMember from './components/BandMember';
import { bandMembers } from './config/bandMembers';
import './App.css';

function App() {
  const [playingAll, setPlayingAll] = useState(false);

  const togglePlayAll = () => {
    setPlayingAll(!playingAll);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Funk Puppets</h1>
      </header>
      <div className="controls">
        <button onClick={togglePlayAll}>
          {playingAll ? 'Stop All' : 'Play All'}
        </button>
      </div>
      <div className="band-container">
        {bandMembers.map((member) => (
          <BandMember
            key={member.id}
            member={member}
            playAll={playingAll}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
