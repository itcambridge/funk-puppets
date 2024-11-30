const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Create SQLite database
const db = new sqlite3.Database('leaderboard.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    // Create scores table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT DEFAULT 'Anonymous',
      score INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Get all scores
app.get('/scores', (req, res) => {
  db.all(`SELECT * FROM scores ORDER BY score DESC`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add new score
app.post('/scores', (req, res) => {
  const { score, name = 'Anonymous' } = req.body;
  if (score === undefined) {
    res.status(400).json({ error: 'Score is required' });
    return;
  }

  db.run(`INSERT INTO scores (name, score) VALUES (?, ?)`,
    [name, score],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        name,
        score,
        timestamp: new Date().toISOString()
      });
    });
});

// Clear all scores (for testing)
app.delete('/scores', (req, res) => {
  db.run(`DELETE FROM scores`, [], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'All scores cleared' });
  });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 