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
    console.log('handleBandMemberPlay called:', { memberName, isPlaying });
    
    setPlayingMembers(prevPlaying => {
      const newPlaying = new Set(prevPlaying);
      if (isPlaying) {
        newPlaying.add(memberName);
        
        // Use drums background for singer
        const bgFileName = isPsychedelic ? 
          `${memberName.toLowerCase() === 'singer' ? 'drums' : memberName.toLowerCase()}-bg2.gif` : 
          `${memberName.toLowerCase() === 'singer' ? 'drums' : memberName.toLowerCase()}-bg.gif`;
        const fullPath = `/assets/background/${bgFileName}`;
        const fullUrl = `${process.env.PUBLIC_URL}${fullPath}`;
        console.log('Setting background to:', fullUrl);
        
        // Verify the file exists first
        const img = new Image();
        img.onload = () => {
          console.log('Background image loaded successfully:', fullUrl);
          const appElement = document.querySelector('.App');
          if (appElement) {
            appElement.style.backgroundImage = `url("${fullUrl}")`;
            appElement.style.backgroundSize = 'cover';
            appElement.style.backgroundPosition = 'center';
            appElement.style.backgroundRepeat = 'no-repeat';
            setCurrentBackground(fullPath);
          }
        };
        img.onerror = () => {
          console.error('Failed to load background image:', fullUrl);
        };
        img.src = fullUrl;
      } else {
        newPlaying.delete(memberName);
        
        if (newPlaying.size === 0) {
          // Reset to default background
          const defaultBg = isPsychedelic ? defaultBackground2 : defaultBackground;
          const fullUrl = `${process.env.PUBLIC_URL}${defaultBg}`;
          const appElement = document.querySelector('.App');
          if (appElement) {
            appElement.style.backgroundImage = `url("${fullUrl}")`;
            appElement.style.backgroundSize = 'cover';
            appElement.style.backgroundPosition = 'center';
            appElement.style.backgroundRepeat = 'no-repeat';
            setCurrentBackground(defaultBg);
          }
        }
      }
      return newPlaying;
    });
  };

  const toggleBackgroundStyle = () => {
    setIsPsychedelic(prev => {
      const newIsPsychedelic = !prev;
      if (playingMembers.size === 0) {
        // Handle default background
        const newBg = newIsPsychedelic ? defaultBackground2 : defaultBackground;
        const fullUrl = `${process.env.PUBLIC_URL}${newBg}`;
        const appElement = document.querySelector('.App');
        if (appElement) {
          appElement.style.backgroundImage = `url("${fullUrl}")`;
          appElement.style.backgroundSize = 'cover';
          appElement.style.backgroundPosition = 'center';
          appElement.style.backgroundRepeat = 'no-repeat';
          setCurrentBackground(newBg);
        }
      } else {
        // Handle member background
        const playingMember = Array.from(playingMembers)[0];
        const bgFileName = newIsPsychedelic ? 
          `${playingMember.toLowerCase() === 'singer' ? 'drums' : playingMember.toLowerCase()}-bg2.gif` : 
          `${playingMember.toLowerCase() === 'singer' ? 'drums' : playingMember.toLowerCase()}-bg.gif`;
        const fullPath = `/assets/background/${bgFileName}`;
        const fullUrl = `${process.env.PUBLIC_URL}${fullPath}`;
        console.log('Toggling background to:', fullUrl);
        
        // Use the same image loading pattern as handleBandMemberPlay
        const img = new Image();
        img.onload = () => {
          console.log('Background image loaded successfully:', fullUrl);
          const appElement = document.querySelector('.App');
          if (appElement) {
            appElement.style.backgroundImage = `url("${fullUrl}")`;
            appElement.style.backgroundSize = 'cover';
            appElement.style.backgroundPosition = 'center';
            appElement.style.backgroundRepeat = 'no-repeat';
            setCurrentBackground(fullPath);
          }
        };
        img.onerror = () => {
          console.error('Failed to load background image:', fullUrl);
        };
        img.src = fullUrl;
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
