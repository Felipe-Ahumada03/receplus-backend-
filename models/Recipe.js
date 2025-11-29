const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredientes: { type: [String], required: true },
  instructions: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  dificultad: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', recipeSchema);