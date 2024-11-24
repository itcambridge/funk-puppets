import React, { useState } from 'react';
import BandMember from './components/BandMember';
import { bandMembers } from './config/bandMembers';
import './App.css';
import defaultBackground from './assets/background/bg.png';
import defaultBackground2 from './assets/background/bg2.png';

function App() {
  const [currentBackground, setCurrentBackground] = useState(defaultBackground);
  const [playingMembers, setPlayingMembers] = useState(new Set());
  const [isPsychedelic, setIsPsychedelic] = useState(false);

  const handleBandMemberPlay = (memberName, isPlaying) => {
    setPlayingMembers(prevPlaying => {
      const newPlaying = new Set(prevPlaying);
      if (isPlaying) {
        newPlaying.add(memberName);
        try {
          const bgFileName = isPsychedelic ? 
            `${memberName.toLowerCase()}-bg2.gif` : 
            `${memberName.toLowerCase()}-bg.gif`;
          const bgPath = require(`./assets/background/${bgFileName}`);
          setCurrentBackground(bgPath);
        } catch (error) {
          console.log(`No background GIF found for ${memberName}`);
        }
      } else {
        newPlaying.delete(memberName);
        if (newPlaying.size === 0) {
          setCurrentBackground(isPsychedelic ? defaultBackground2 : defaultBackground);
        }
      }
      return newPlaying;
    });
  };

  const toggleBackgroundStyle = () => {
    setIsPsychedelic(!isPsychedelic);
    if (playingMembers.size === 0) {
      setCurrentBackground(!isPsychedelic ? defaultBackground2 : defaultBackground);
    } else {
      const playingMember = Array.from(playingMembers)[0];
      try {
        const bgFileName = !isPsychedelic ? 
          `${playingMember.toLowerCase()}-bg2.gif` : 
          `${playingMember.toLowerCase()}-bg.gif`;
        const bgPath = require(`./assets/background/${bgFileName}`);
        setCurrentBackground(bgPath);
      } catch (error) {
        console.log(`No background GIF found for ${playingMember}`);
      }
    }
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${currentBackground})` }}>
      <header className="App-header">
        <img 
          src={process.env.PUBLIC_URL + '/assets/gifs/logo.gif'} 
          alt="Funk Puppets Logo"
          className="logo-gif"
        />
      </header>
      <div className="style-toggle">
        <button 
          className={`style-button ${!isPsychedelic ? 'active' : ''}`}
          onClick={toggleBackgroundStyle}
        >
          {isPsychedelic ? '🌙 Moonlight' : '🌈 Psychedelic'}
        </button>
      </div>
      <div className="band-container">
        {bandMembers.map((member) => (
          <BandMember
            key={member.id}
            member={member}
            onMemberClick={(isPlaying) => handleBandMemberPlay(member.name, isPlaying)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
