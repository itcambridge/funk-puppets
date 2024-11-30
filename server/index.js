const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Create SQLite database
const db = new Database(process.env.DB_PATH || 'leaderboard.db', { verbose: console.log });

// Create scores table if it doesn't exist
db.exec(`CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT DEFAULT 'Anonymous',
  score INTEGER NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Get all scores
app.get('/scores', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM scores ORDER BY score DESC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new score
app.post('/scores', (req, res) => {
  const { score, name = 'Anonymous' } = req.body;
  if (score === undefined) {
    res.status(400).json({ error: 'Score is required' });
    return;
  }

  try {
    const insert = db.prepare('INSERT INTO scores (name, score) VALUES (?, ?)');
    const result = insert.run(name, score);
    res.json({
      id: result.lastInsertRowid,
      name,
      score,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear all scores (for testing)
app.delete('/scores', (req, res) => {
  try {
    db.prepare('DELETE FROM scores').run();
    res.json({ message: 'All scores cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 