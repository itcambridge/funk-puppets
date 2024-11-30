import React, { useState, useEffect, useCallback } from 'react';
import BandMember from './components/BandMember.js';
import FloatingPoints from './components/FloatingPoints.js';
import Scoreboard from './components/Scoreboard.js';
import { bandMembers } from './config/bandMembers.js';
import { Howl } from 'howler';
import './App.css';
import ReactGA from 'react-ga4';

// Initialize GA with your actual tracking ID
ReactGA.initialize('G-K7ZY28NXTT');

const defaultBackground = '/assets/background/bg.png';
const defaultBackground2 = '/assets/background/bg2.png';
const gameOverSound = new Howl({
  src: ['/assets/sounds/Game_Over.mp3'],
  volume: 0.5
});

function App() {
  const [currentBackground, setCurrentBackground] = useState(defaultBackground);
  const [playingMembers, setPlayingMembers] = useState(new Set());
  const [isPsychedelic, setIsPsychedelic] = useState(false);
  const [syncedMembers, setSyncedMembers] = useState(new Set());
  const [showMaxedOutWarning, setShowMaxedOutWarning] = useState(false);
  const [isTryingToAddMore, setIsTryingToAddMore] = useState(false);
  const [score, setScore] = useState(0);
  const [lastScoreTime, setLastScoreTime] = useState(0);
  const [floatingPoints, setFloatingPoints] = useState([]);
  const [previousSyncState, setPreviousSyncState] = useState(new Set());
  const [combinationStartTime, setCombinationStartTime] = useState(0);
  const [lastSyncCombination, setLastSyncCombination] = useState(new Set());
  const [consecutiveZeros, setConsecutiveZeros] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [leaderboardScores, setLeaderboardScores] = useState([]);
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [singlePlayerChecks, setSinglePlayerChecks] = useState(0);
  
  const MAX_PLAYING_MEMBERS = 3;
  const SCORE_INTERVAL = 2000; // Show points every 2 seconds
  const MAX_COMBINATION_TIME = 8000; // Maximum time to score points for same combination
  const POINTS_PER_SYNC = 10;
  const ZEROS_FOR_STRIKE = 4; // Number of consecutive zeros needed for a strike
  const MAX_STRIKES = 3; // Game over at this many strikes

  const areSetsEqual = (a, b) => {
    if (a.size !== b.size) return false;
    for (let item of a) if (!b.has(item)) return false;
    return true;
  };

  const handleBandMemberPlay = (memberName, isPlaying) => {
    if (isGameOver) return; // Prevent playing if game is over
    
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
        // Reset border when stopping
        const element = document.querySelector(`.band-member[data-member="${memberName}"]`);
        if (element) {
          element.style.border = '';
        }
      }
      return newPlaying;
    });
  };

  const toggleBackground = () => {
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
    const now = Date.now();
    
    // Show zero points and increment counter for single player
    if (playingMembers.size === 1 && now - lastScoreTime >= SCORE_INTERVAL) {
      // Position in the middle-top of the screen for single player
      const syncCenter = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 3
      };
      
      setFloatingPoints(prev => [...prev, { 
        points: 0, 
        id: Date.now(),
        position: syncCenter
      }]);
      setLastScoreTime(now);
      
      // Track single player checks and only start counting zeros after 4 checks
      setSinglePlayerChecks(prev => {
        const newCount = prev + 1;
        if (newCount <= 4) {
          // Don't increment consecutive zeros during grace period
          return newCount;
        } else {
          // After grace period, increment consecutive zeros
          setConsecutiveZeros(prev => {
            const newCount = prev + 1;
            console.log(`Consecutive zeros: ${newCount}`);
            if (newCount >= ZEROS_FOR_STRIKE) {
              setStrikes(prevStrikes => {
                const newStrikes = prevStrikes + 1;
                console.log(`Strike added! Total strikes: ${newStrikes}`);
                return newStrikes;
              });
              return 0; // Reset consecutive zeros after adding a strike
            }
            return newCount;
          });
          return newCount;
        }
      });
      return;
    } else {
      // Reset single player checks when more than one player
      setSinglePlayerChecks(0);
    }

    if (playingMembers.size > 1) {
      const memberElements = Array.from(document.querySelectorAll('.band-member[data-member]'));
      console.log('Active playing members:', Array.from(playingMembers));
      
      const playingElements = memberElements.filter(el => 
        playingMembers.has(el.dataset.member)
      );

      const positions = playingElements.map(el => {
        const position = parseFloat(el.getAttribute('data-current-position') || '0');
        const duration = parseFloat(el.getAttribute('data-duration') || '0');
        console.log(`${el.dataset.member} position:`, position);
        return { 
          member: el.dataset.member, 
          position,
          normalizedPosition: duration ? (position % duration) : position,
          element: el
        };
      }).filter(({ position }) => position >= 0);

      if (positions.length > 1) {
        const maxDiff = 100; // 100ms tolerance for sync
        const syncedPairs = new Set();
        const differences = [];
        let syncCenter = { x: 0, y: 0 };
        let syncCount = 0;

        // Compare each position against each other position
        for (let i = 0; i < positions.length; i++) {
          for (let j = i + 1; j < positions.length; j++) {
            const diff = Math.abs(positions[i].normalizedPosition - positions[j].normalizedPosition);
            differences.push({
              members: [positions[i].member, positions[j].member],
              diff
            });
            if (diff < maxDiff) {
              syncedPairs.add(positions[i].member);
              syncedPairs.add(positions[j].member);
              
              const rect1 = positions[i].element.getBoundingClientRect();
              const rect2 = positions[j].element.getBoundingClientRect();
              syncCenter.x += (rect1.left + rect1.width/2 + rect2.left + rect2.width/2) / 2;
              syncCenter.y += (rect1.top + rect2.top) / 2;
              syncCount++;
            }
          }
        }

        if (syncCount > 0) {
          syncCenter.x /= syncCount;
          syncCenter.y /= syncCount;
        }

        // Calculate which members are partially synced
        const partiallySyncedMembers = new Set();
        positions.forEach((pos1, i) => {
          positions.forEach((pos2, j) => {
            if (i !== j) {
              const diff = Math.abs(pos1.normalizedPosition - pos2.normalizedPosition);
              if (diff < maxDiff) {
                partiallySyncedMembers.add(pos1.member);
                partiallySyncedMembers.add(pos2.member);
              }
            }
          });
        });

        // A member is fully synced only if it's in sync with ALL other playing members
        const fullySyncedMembers = new Set();
        if (differences.every(({diff}) => diff < maxDiff)) {
          positions.forEach(pos => fullySyncedMembers.add(pos.member));
        }

        // Update member elements with appropriate sync status
        positions.forEach(({member, element}) => {
          if (fullySyncedMembers.has(member)) {
            element.style.border = '3px solid rgb(0, 255, 0)'; // Bright green border for fully synced
          } else if (partiallySyncedMembers.has(member)) {
            element.style.border = '3px solid rgb(0, 0, 255)'; // Blue border for partially synced
          } else {
            element.style.border = ''; // Reset to default
          }
        });

        setSyncedMembers(prev => {
          const newSynced = new Set(syncedPairs);
          
          const now = Date.now();
          
          // Only reset combination timer if this is a different combination than the last one
          if (newSynced.size >= 2 && !areSetsEqual(newSynced, lastSyncCombination)) {
            console.log('New sync combination detected, resetting timer');
            setCombinationStartTime(now);
            setLastSyncCombination(newSynced);
          }
          
          // Check if we should show points
          if (newSynced.size >= 2 && now - lastScoreTime >= SCORE_INTERVAL) {
            const timeSinceCombinationStart = now - combinationStartTime;
            const withinTimeWindow = timeSinceCombinationStart <= MAX_COMBINATION_TIME;
            const areAllInSync = differences.every(({diff}) => diff < maxDiff);
            
            // Only add points if within time window AND currently in sync
            const pointsToAdd = (withinTimeWindow && areAllInSync) ? POINTS_PER_SYNC * (newSynced.size - 1) : 0;
            
            // Handle consecutive zeros and strikes
            if (pointsToAdd === 0) {
              setConsecutiveZeros(prev => {
                const newCount = prev + 1;
                console.log(`Consecutive zeros: ${newCount}`);
                if (newCount >= ZEROS_FOR_STRIKE) {
                  setStrikes(prevStrikes => {
                    const newStrikes = prevStrikes + 1;
                    console.log(`Strike added! Total strikes: ${newStrikes}`);
                    return newStrikes;
                  });
                  return 0; // Reset consecutive zeros after adding a strike
                }
                return newCount;
              });
            } else {
              setConsecutiveZeros(0); // Reset on any points scored
            }
            
            if (pointsToAdd > 0) {
              console.log(`Adding ${pointsToAdd} points for sync combination (${timeSinceCombinationStart}ms into combination)`);
              setScore(prevScore => {
                const newScore = prevScore + pointsToAdd;
                console.log(`Score updated: ${prevScore} -> ${newScore}`);
                return newScore;
              });
            } else if (withinTimeWindow) {
              console.log(`No points awarded - members out of sync (${timeSinceCombinationStart}ms into combination)`);
            } else {
              console.log(`No points awarded - exceeded ${MAX_COMBINATION_TIME}ms time window`);
            }
            
            setLastScoreTime(now);
            setPreviousSyncState(newSynced);
            
            // Show floating points (including zero points)
            const id = Date.now();
            setFloatingPoints(prev => [...prev, { 
              points: pointsToAdd, 
              id,
              position: syncCenter
            }]);
          }
          
          return newSynced;
        });
      } else {
        setPreviousSyncState(new Set());
        setSyncedMembers(new Set());
      }
    } else {
      setPreviousSyncState(new Set());
      setSyncedMembers(new Set());
      setLastSyncCombination(new Set());
      setCombinationStartTime(0);
    }
  }, [playingMembers, lastScoreTime, previousSyncState, combinationStartTime, lastSyncCombination]);

  // Handle removing floating points after animation
  const handleFloatingPointsComplete = (id) => {
    setFloatingPoints(prev => prev.filter(p => p.id !== id));
  };

  // Set up sync detection interval
  useEffect(() => {
    const syncInterval = setInterval(checkSync, 100);
    return () => clearInterval(syncInterval);
  }, [checkSync]);

  // Track page views
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  useEffect(() => {
    if (strikes >= MAX_STRIKES && !isGameOver) {
      setIsGameOver(true);
      gameOverSound.play();  // Play the game over sound
      
      // Stop all playing members
      playingMembers.forEach(member => {
        const bandMemberElement = document.querySelector(`[data-member="${member}"]`);
        if (bandMemberElement) {
          const playButton = bandMemberElement.querySelector('.play-button');
          if (playButton) {
            playButton.click();
          }
        }
      });
    }
  }, [strikes, isGameOver, playingMembers]);

  const handleSubmitScore = (e) => {
    e.preventDefault();
    setIsSubmittingScore(true);

    fetch('http://localhost:3005/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        score,
        name: playerName || 'Anonymous'
      })
    })
    .then(response => response.json())
    .then(() => {
      // After submitting, fetch updated scores
      return fetch('http://localhost:3005/scores');
    })
    .then(response => response.json())
    .then(data => {
      const topScores = data
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      setLeaderboardScores(topScores);
      setIsSubmittingScore(false);
      setIsSubmitted(true);
    })
    .catch(error => {
      console.error('Error with leaderboard:', error);
      setIsSubmittingScore(false);
    });
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${currentBackground})` }}>
      {!isGameOver && <Scoreboard />}
      <div className="member-counter">
        Tracks: {playingMembers.size}
      </div>
      <div className="game-status">
        <div className="score">Score: {score}</div>
        <div className="strikes">{"❌".repeat(strikes)}</div>
        {consecutiveZeros > 0 && (
          <div className="zero-counter">
            Zero Points: {consecutiveZeros}/{ZEROS_FOR_STRIKE}
          </div>
        )}
      </div>
      {isGameOver ? (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p className="final-score">Final Score: {score}</p>
          {!isSubmitted ? (
            <form onSubmit={handleSubmitScore} className="score-submit-form">
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
              />
              <button type="submit" disabled={isSubmittingScore}>
                {isSubmittingScore ? 'Submitting...' : 'Submit Score'}
              </button>
            </form>
          ) : (
            <div className="leaderboard">
              <h3>Top Scores</h3>
              <div className="scores-list">
                {leaderboardScores.map((entry, index) => (
                  <div 
                    key={index} 
                    className={`score-entry ${entry.score === score && entry.name === playerName ? 'current-score' : ''}`}
                  >
                    <span className="rank">#{index + 1}</span>
                    <span className="player-name">{entry.name}</span>
                    <span className="score-value">{entry.score}</span>
                    <span className="score-date">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
              <button className="play-again" onClick={() => window.location.reload()}>
                Play Again
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {(playingMembers.size >= MAX_PLAYING_MEMBERS) && (
            <div className="maxed-out-warning">
              {isTryingToAddMore ? 'Too Many!' : 'Maxed out!'}
            </div>
          )}
          <div className="style-toggle">
            <button
              className={`style-button ${isPsychedelic ? 'active' : ''}`}
              onClick={toggleBackground}
            >
              🌈 Psychedelic
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
          {floatingPoints.map(({ points, id, position }) => (
            <FloatingPoints
              key={id}
              points={points}
              position={position}
              onAnimationComplete={() => handleFloatingPointsComplete(id)}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default App;
