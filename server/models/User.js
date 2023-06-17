const mongoose = require('mongoose');

// Definicja schematu użytkownika
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Utworzenie modelu użytkownika na podstawie schematu
const User = mongoose.model('User', userSchema);

module.exports = User;
