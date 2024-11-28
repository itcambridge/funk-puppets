import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';

function BandMember({ member, onMemberClick, isInSync }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(member.tracks[0]);
  const [sound, setSound] = useState(null);
  const [error, setError] = useState(null);
  const [tempo, setTempo] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [imageError, setImageError] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    console.log('Static Image Path:', process.env.PUBLIC_URL + member.imagePath);
    console.log('GIF Path:', process.env.PUBLIC_URL + member.gifPath);
  }, [member]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const soundPath = `${process.env.PUBLIC_URL}${member.soundBase}${currentTrack}.mp3`;
    console.log(`Attempting to load sound from: ${soundPath}`);

    let newSound = new Howl({
      src: [soundPath],
      loop: true,
      html5: true,
      rate: tempo,
      volume: volume,
      onload: () => {
        console.log(`${member.name} loaded:`, soundPath);
        setError(null);
        if (isPlaying) {
          newSound.play();
          setCurrentPosition(0);
        }
      },
      onplay: () => {
        setCurrentPosition(0);
        const element = document.querySelector(`.band-member[data-member="${member.name}"]`);
        if (element) {
          element.setAttribute('data-current-position', '0');
          element.setAttribute('data-duration', (newSound.duration() * 1000).toString());
        }
      },
      onend: () => {
        setCurrentPosition(0);
        const element = document.querySelector(`.band-member[data-member="${member.name}"]`);
        if (element) {
          element.setAttribute('data-current-position', '0');
        }
      },
      onloaderror: (id, err) => {
        console.error(`Error loading sound ${soundPath}:`, err);
        setError(`Failed to load sound file: ${soundPath}`);
      },
      onplayerror: (id, err) => {
        console.error(`Error playing sound ${soundPath}:`, err);
        setError(`Failed to play sound file: ${soundPath}`);
      }
    });

    setSound(newSound);

    return () => {
      newSound.unload();
    };
  }, [currentTrack, member.soundBase, member.name, isPlaying]);

  useEffect(() => {
    if (sound) {
      sound.rate(tempo);
    }
  }, [tempo, sound]);

  useEffect(() => {
    if (sound) {
      sound.volume(volume);
    }
  }, [volume, sound]);

  useEffect(() => {
    let positionInterval;
    if (isPlaying && sound) {
      positionInterval = setInterval(() => {
        const position = sound.seek() * 1000; // Convert to milliseconds
        setCurrentPosition(position);
        const element = document.querySelector(`.band-member[data-member="${member.name}"]`);
        if (element) {
          element.setAttribute('data-current-position', position.toString());
        }
      }, 50); // Update every 50ms for smooth tracking
    }
    return () => {
      if (positionInterval) {
        clearInterval(positionInterval);
      }
    };
  }, [isPlaying, sound, member.name]);

  const handleTempoChange = (e) => {
    e.stopPropagation();
    const newTempo = parseFloat(e.target.value);
    setTempo(newTempo);
  };

  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleTouchStart = (e) => {
    e.stopPropagation();
  };

  const handlePlayClick = () => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    
    onMemberClick(newIsPlaying);
  };

  return (
    <div 
      className={`band-member ${isInSync ? 'in-sync' : ''}`}
      data-member={member.name}
      data-tempo={tempo}
      data-current-position={currentPosition}
    >
      <div className="member-name">{member.name}</div>
      <img
        src={`${process.env.PUBLIC_URL}${isPlaying ? member.gifPath : member.imagePath}`}
        alt={member.name}
        onError={(e) => {
          console.error(`Failed to load image: ${e.target.src}`);
          setImageError(true);
          setError('Failed to load image');
        }}
      />
      {imageError && <div style={{color: 'red'}}>Image failed to load</div>}
      <div className="member-controls">
        <div className="track-buttons">
          {member.tracks.map((trackNum) => (
            <button
              key={trackNum}
              className={`track-button ${currentTrack === trackNum ? 'active' : ''}`}
              onClick={() => setCurrentTrack(trackNum)}
            >
              Track {trackNum}
            </button>
          ))}
        </div>
        <div className="tempo-control">
          <input
            type="range"
            min="0.8"
            max="1.2"
            step="0.05"
            value={tempo}
            onChange={handleTempoChange}
            onTouchStart={handleTouchStart}
            className="tempo-slider"
          />
          <div className="tempo-label">Speed: {tempo.toFixed(2)}x</div>
        </div>
        <div className="volume-control">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            onTouchStart={handleTouchStart}
            className="volume-slider"
          />
          <div className="volume-label">Volume: {Math.round(volume * 100)}%</div>
        </div>
        <button 
          className={`play-button ${isPlaying ? 'playing' : ''}`}
          onClick={handlePlayClick}
        >
          {isPlaying ? 'Stop' : 'Play'}
        </button>
        {error && <div className="error-message" style={{color: 'red', fontSize: '0.8em'}}>{error}</div>}
      </div>
    </div>
  );
}

export default BandMember; 