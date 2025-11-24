const Recipe = require('../models/Recipe');
const User = require('../models/User'); // asegúrate de que este modelo exista

// Buscar recomendaciones por preferencias guardadas del usuario
exports.getRecommendedRecipes = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Extraemos preferencias del usuario
    const { 
      favoriteFoods = [], 
      dislikedIngredients = [], 
      allergies = [], 
      dietaryRestrictions = []
    } = user.preferences || {};

    console.log("Preferencias del usuario:", user.preferences);

    // Filtro dinámico según preferencias
    const query = {
      $and: [
        // No incluir ingredientes prohibidos
        { ingredientes: { $nin: [...dislikedIngredients, ...allergies] } },

        // Opcional: alimentos favoritos como coincidencia parcial
        favoriteFoods.length > 0
          ? { categoria: { $in: favoriteFoods } }
          : {},

        // Opcional: restricciones dietéticas
        dietaryRestrictions.length > 0
          ? { etiquetas: { $in: dietaryRestrictions } }
          : {}
      ]
    };

    // Buscar recetas en MongoDB
    const recetas = await Recipe.find(query);

    res.json(recetas);
  } catch (error) {
    console.error("Error en recomendaciones:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
