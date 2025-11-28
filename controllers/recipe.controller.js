const Recipe = require('../models/Recipe');

exports.searchByIngredients = async (req, res) => {
  try {
    const raw = req.query.ingredient;
    if (!raw) return res.status(400).json({ error: 'Debes proporcionar ingredientes' });

    const ingredientes = raw
      .split(',')
      .map(i => i.trim().toLowerCase()); // importante: minúsculas y sin espacios

    const results = await Recipe.find({
      ingredientes: { $all: ingredientes } // MongoDB: debe contener todos los ingredientes
    });

    res.json(results);
  } catch (error) {
    console.error('Error en búsqueda:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
