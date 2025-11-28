const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },

  // Ingredientes con cantidad
  ingredientes: [
    {
      nombre: { type: String, required: true },
      cantidad: { type: String, required: true }   // Ej: "2 cucharadas", "1 taza", "500 g"
    }
  ],

  instructions: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  dificultad: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', recipeSchema);