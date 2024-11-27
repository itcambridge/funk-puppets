import React, { useState, useEffect } from 'react';
import BandMember from './components/BandMember.js';
import { bandMembers } from './config/bandMembers.js';
import './App.css';
import ReactGA from 'react-ga4';

// Initialize GA with your actual tracking ID
ReactGA.initialize('G-K7ZY28NXTT');

const defaultBackground = '/assets/background/bg.png';
const defaultBackground2 = '/assets/background/bg2.png';

function App() {
  const [currentBackground, setCurrentBackground] = useState(defaultBackground);
  const [playingMembers, setPlayingMembers] = useState(new Set());
  const [isPsychedelic, setIsPsychedelic] = useState(false);

  const handleBandMemberPlay = (memberName, isPlaying) => {
    setPlayingMembers(prevPlaying => {
      const newPlaying = new Set(prevPlaying);
      if (isPlaying) {
        newPlaying.add(memberName);
        
        // Update background
        const bgFileName = isPsychedelic ? 
          `${memberName.toLowerCase()}-bg2.gif` : 
          `${memberName.toLowerCase()}-bg.gif`;
        const fullPath = `/assets/background/${bgFileName}`;
        console.log('Setting background to:', fullPath);
        
        // Force background update
        const appElement = document.querySelector('.App');
        appElement.style.backgroundImage = `url(${fullPath})`;
        appElement.style.backgroundSize = 'cover';
        appElement.style.backgroundRepeat = 'no-repeat';
        setCurrentBackground(fullPath);
      } else {
        newPlaying.delete(memberName);
        
        if (newPlaying.size === 0) {
          // Reset to default background
          const defaultBg = isPsychedelic ? defaultBackground2 : defaultBackground;
          const appElement = document.querySelector('.App');
          appElement.style.backgroundImage = `url(${defaultBg})`;
          appElement.style.backgroundSize = 'cover';
          appElement.style.backgroundRepeat = 'no-repeat';
          setCurrentBackground(defaultBg);
        }
      }
      return newPlaying;
    });
  };

  const toggleBackgroundStyle = () => {
    setIsPsychedelic(prev => {
      const newIsPsychedelic = !prev;
      if (playingMembers.size === 0) {
        const newBg = newIsPsychedelic ? defaultBackground2 : defaultBackground;
        const appElement = document.querySelector('.App');
        appElement.style.backgroundImage = `url(${newBg})`;
        appElement.style.backgroundSize = 'cover';
        appElement.style.backgroundRepeat = 'no-repeat';
        setCurrentBackground(newBg);
      } else {
        const playingMember = Array.from(playingMembers)[0];
        const bgFileName = newIsPsychedelic ? 
          `${playingMember.toLowerCase()}-bg2.gif` : 
          `${playingMember.toLowerCase()}-bg.gif`;
        const fullPath = `/assets/background/${bgFileName}`;
        console.log('Toggling background to:', fullPath);
        
        const appElement = document.querySelector('.App');
        appElement.style.backgroundImage = `url(${fullPath})`;
        appElement.style.backgroundSize = 'cover';
        appElement.style.backgroundRepeat = 'no-repeat';
        setCurrentBackground(fullPath);
      }
      return newIsPsychedelic;
    });
  };

  // Track page views
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

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
