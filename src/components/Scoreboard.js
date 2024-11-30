import React, { useState, useEffect } from 'react';

// Use environment-aware API URL
const API_URL = process.env.NODE_ENV === 'production'
  ? `/api/scores`  // In production, use relative path
  : 'http://localhost:3005/scores';  // In development, use localhost

function Scoreboard() {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScores();
    // Refresh scores every 30 seconds
    const interval = setInterval(fetchScores, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchScores = () => {
    setIsLoading(true);
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        const topScores = data
          .sort((a, b) => b.score - a.score)
          .slice(0, 3); // Show top 3 scores
        setScores(topScores);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching scores:', err);
        setError('Failed to load scores');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="scoreboard">
      <h3>Top Scores</h3>
      {isLoading ? (
        <p>Loading scores...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="scores-list">
          {scores.map((score, index) => (
            <div key={index} className="score-entry">
              <span className="rank">#{index + 1}</span>
              <span className="player-name">{score.name}</span>
              <span className="score-value">{score.score}</span>
              <span className="score-date">
                {new Date(score.timestamp).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Scoreboard; 