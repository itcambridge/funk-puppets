import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

// Use environment-aware API URL
const API_URL = process.env.NODE_ENV === 'production'
  ? `${window.location.origin}/api/leaderboard`  // In production, use domain
  : 'http://localhost:3001/api/leaderboard';  // In development, use localhost

function Leaderboard({ isVisible, onClose, currentScore }) {
  const [scores, setScores] = useState([]);
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (isVisible) {
      fetchScores();
    }
  }, [isVisible]);

  // Reset submission state when score changes
  useEffect(() => {
    setHasSubmitted(false);
  }, [currentScore]);

  const fetchScores = async (retry = true) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setScores(data);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      if (retry && retryCount < 3) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchScores(true), 1000); // Retry after 1 second
      } else {
        setError('Failed to fetch leaderboard. Please ensure the server is running.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    fetchScores(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playerName.trim() || hasSubmitted) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playerName.trim(),
          score: currentScore
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit score');
      }

      await fetchScores(false);  // Don't retry on submit success
      setPlayerName('');
      setHasSubmitted(true);
    } catch (err) {
      console.error('Error submitting score:', err);
      setError('Failed to submit score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="leaderboard-overlay">
      <div className="leaderboard-content">
        <h2>🏆 Leaderboard 🏆</h2>
        {error && (
          <div className="error-message">
            {error}
            <button className="retry-button" onClick={handleRetry}>
              Try Again
            </button>
          </div>
        )}
        
        <div className="current-score">
          Your Score: {currentScore}
        </div>

        {!hasSubmitted ? (
          <form onSubmit={handleSubmit} className="submit-score-form">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              disabled={isSubmitting || isLoading}
            />
            <button type="submit" disabled={isSubmitting || isLoading || !playerName.trim()}>
              {isSubmitting ? 'Submitting...' : 'Submit Score'}
            </button>
          </form>
        ) : (
          <div className="score-submitted-message">
            Score submitted! 🌟
          </div>
        )}

        <div className="scores-list">
          {isLoading ? (
            <div className="loading-message">Loading scores...</div>
          ) : (
            <>
              {scores.map((score, index) => (
                <div key={score.id} className="score-item">
                  <span className="rank">#{index + 1}</span>
                  <span className="name">{score.name}</span>
                  <span className="score">{score.score}</span>
                </div>
              ))}
              {scores.length === 0 && !error && (
                <div className="no-scores">No scores yet. Be the first!</div>
              )}
            </>
          )}
        </div>

        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default Leaderboard; 