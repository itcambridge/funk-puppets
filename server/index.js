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
    // Create leaderboard table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      score INTEGER NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Get top 10 scores
app.get('/api/leaderboard', (req, res) => {
  db.all(`SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add new score
app.post('/api/leaderboard', (req, res) => {
  const { name, score } = req.body;
  if (!name || !score) {
    res.status(400).json({ error: 'Name and score are required' });
    return;
  }

  db.run(`INSERT INTO leaderboard (name, score) VALUES (?, ?)`,
    [name, score],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        name,
        score
      });
    });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 