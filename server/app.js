require('dotenv').config();

const User = require('./models/User');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

// Połączenie z bazą danych MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definicja modelu notatki
const Note = mongoose.model('Note', {
  title: String,
  content: String,
  username: String,
});

app.use(express.json());

const cors = require('cors');
app.use(cors());

// Middleware uwierzytelniania tokena JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    return next();
  });
};



// Trasa GET dla pobrania wszystkich notatek (chroniona)
app.get('/api/notes', authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Wystąpił błąd podczas pobierania notatek' });
  }
});

// Trasa POST dla tworzenia nowej notatki (chroniona)
app.post(
  '/api/notes',
  [
    body('title').notEmpty().withMessage('Tytuł jest wymagany'),
    body('content').notEmpty().withMessage('Treść jest wymagana'),
  ],
  authenticateToken,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const username = req.user.username;

    try {
      const note = new Note({ title, content, username }); 
      await note.save();
      res.json(note);
    } catch (err) {
      res.status(500).json({ error: 'Wystąpił błąd podczas tworzenia notatki' });
    }
  }
);

// Trasa PUT dla aktualizacji notatki (chroniona)
app.put('/api/notes/:id', authenticateToken, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Wprowadź tytuł i treść notatki' });
  }

  try {
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, {
      title,
      content,
    }, { new: true });
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji notatki' });
  }
});

// Trasa DELETE dla usuwania notatki (chroniona)
app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
  try {
    await Note.findByIdAndRemove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Wystąpił błąd podczas usuwania notatki' });
  }
});

// Trasa do rejestracji użytkownika
app.post('/api/register', async (req, res) => {
  // Sprawdź dane rejestracji
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Wprowadź nazwę użytkownika i hasło' });
  }

  try {
    // Sprawdź, czy użytkownik o podanej nazwie już istnieje
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Nazwa użytkownika jest już zajęta' });
    }

    // Stwórz nowego użytkownika
    const user = new User({ username, password });
    await user.save();

    // Wygeneruj token JWT
    const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET);

    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ error: 'Wystąpił błąd podczas rejestracji użytkownika' });
  }
});

// Trasa do logowania użytkownika i generowania tokena JWT
app.post('/api/login', async (req, res) => {
  // Sprawdź dane logowania
  const { username, password } = req.body;

  try {
    // Sprawdź, czy istnieje użytkownik o podanej nazwie
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Błędne dane logowania' });
    }

    // Sprawdź, czy hasło jest poprawne
    if (password !== user.password) {
      return res.status(401).json({ error: 'Błędne dane logowania' });
    }

    // Wygeneruj token JWT
    const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET);

    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ error: 'Wystąpił błąd podczas logowania' });
  }
});

// Trasa GET dla chronionego zasobu przykładowego (chroniona)
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Oto chroniony zasób' });
});

// Uruchomienie serwera na porcie 3001
app.listen(3001, () => {
  console.log('Serwer uruchomiony na porcie 3001');
});
