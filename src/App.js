import React, { useState, useEffect, useCallback } from 'react';
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
  const [syncedMembers, setSyncedMembers] = useState(new Set());
  const [showMaxedOutWarning, setShowMaxedOutWarning] = useState(false);
  const [isTryingToAddMore, setIsTryingToAddMore] = useState(false);
  const MAX_PLAYING_MEMBERS = 3;

  const handleBandMemberPlay = (memberName, isPlaying) => {
    console.log('handleBandMemberPlay called:', { memberName, isPlaying });
    
    setPlayingMembers(prevPlaying => {
      const newPlaying = new Set(prevPlaying);
      if (isPlaying) {
        // Check if adding this member would exceed the limit
        if (newPlaying.size >= MAX_PLAYING_MEMBERS) {
          setShowMaxedOutWarning(true);
          setIsTryingToAddMore(true);
          return newPlaying; // Return without adding the new member
        }
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
        // Hide warning when below max members
        if (newPlaying.size < MAX_PLAYING_MEMBERS) {
          setShowMaxedOutWarning(false);
          setIsTryingToAddMore(false);
        } else if (newPlaying.size === MAX_PLAYING_MEMBERS) {
          // Reset to "Maxed out" when back to 3 members
          setShowMaxedOutWarning(true);
          setIsTryingToAddMore(false);
        }
        // Remove from synced members when stopping
        setSyncedMembers(prev => {
          const newSynced = new Set(prev);
          newSynced.delete(memberName);
          return newSynced;
        });
        
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

  const checkSync = useCallback(() => {
    if (playingMembers.size > 1) {
      const memberElements = Array.from(document.querySelectorAll('.band-member[data-member]'));
      console.log('Active playing members:', Array.from(playingMembers));
      
      const playingElements = memberElements.filter(el => 
        playingMembers.has(el.dataset.member)
      );

      // Get all current positions
      const positions = playingElements.map(el => {
        const position = parseFloat(el.getAttribute('data-current-position') || '0');
        const duration = parseFloat(el.getAttribute('data-duration') || '0');
        console.log(`${el.dataset.member} position:`, position);
        return { 
          member: el.dataset.member, 
          position,
          normalizedPosition: duration ? (position % duration) : position 
        };
      }).filter(({ position }) => position >= 0);

      console.log('Current positions:', positions);

      if (positions.length > 1) {
        const maxDiff = 50; // 50ms tolerance for extremely tight sync
        const syncedPairs = new Set();
        const differences = [];

        // Compare each position against each other position
        for (let i = 0; i < positions.length; i++) {
          for (let j = i + 1; j < positions.length; j++) {
            const diff = Math.abs(positions[i].normalizedPosition - positions[j].normalizedPosition);
            differences.push({
              members: [positions[i].member, positions[j].member],
              diff
            });
            console.log(`Position diff between ${positions[i].member} and ${positions[j].member}: ${diff}ms`);
            if (diff < maxDiff) {
              // If these two are in sync, add both to the synced set
              syncedPairs.add(positions[i].member);
              syncedPairs.add(positions[j].member);
            }
          }
        }

        console.log('Position differences:', differences);
        console.log('Synced pairs:', Array.from(syncedPairs));

        setSyncedMembers(prev => {
          const newSynced = new Set(syncedPairs);
          console.log('Setting synced members:', Array.from(newSynced));
          return newSynced;
        });
      }
    }
  }, [playingMembers, setSyncedMembers]);

  // Set up sync detection interval
  useEffect(() => {
    const syncInterval = setInterval(checkSync, 100);
    return () => clearInterval(syncInterval);
  }, [checkSync]);

  // Track page views
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  return (
    <div className="App" style={{ backgroundImage: `url(${currentBackground})` }}>
      {(playingMembers.size >= MAX_PLAYING_MEMBERS) && (
        <div className="maxed-out-warning">
          {isTryingToAddMore ? 'Too Many!' : 'Maxed out!'}
        </div>
      )}
      <div className="member-counter">
        Band Members: {playingMembers.size}
      </div>
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
            isInSync={syncedMembers.has(member.name)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
