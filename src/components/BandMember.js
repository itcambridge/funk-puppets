import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';
import ReactGA from 'react-ga4';

function BandMember({ member, onMemberClick }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(member.tracks[0]);
  const [sound, setSound] = useState(null);
  const [error, setError] = useState(null);
  const [tempo, setTempo] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    console.log('Static Image Path:', process.env.PUBLIC_URL + member.imagePath);
    console.log('GIF Path:', process.env.PUBLIC_URL + member.gifPath);
  }, [member]);

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
        console.log(`Successfully loaded: ${soundPath}`);
        setError(null);
        if (isPlaying) {
          newSound.play();
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
  }, [currentTrack, member.soundBase]);

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

  const togglePlay = () => {
    if (sound) {
      try {
        if (isPlaying) {
          sound.pause();
          ReactGA.event({
            category: 'Track',
            action: 'Stop',
            label: `${member.name} - Track ${currentTrack}`
          });
        } else {
          sound.play();
          ReactGA.event({
            category: 'Track',
            action: 'Play',
            label: `${member.name} - Track ${currentTrack}`,
            value: Math.round(tempo * 100)
          });
        }
        setIsPlaying(!isPlaying);
      } catch (err) {
        console.error(`Error toggling play state:`, err);
        setError(`Failed to ${isPlaying ? 'stop' : 'play'} sound`);
      }
    } else {
      console.error('No sound loaded for', member.name);
      setError('Sound not loaded yet');
    }
  };

  return (
    <div className="band-member">
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
          onClick={togglePlay}
        >
          {isPlaying ? 'Stop' : 'Play'}
        </button>
        {error && <div className="error-message" style={{color: 'red', fontSize: '0.8em'}}>{error}</div>}
      </div>
    </div>
  );
}

export default BandMember; 