const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { verifyToken, verifyAdmin } = require('../controllers/auth.controller');

//  Buscar recetas por ingredientes (público)
router.get('/search', async (req, res) => {
  const raw = req.query.ingredient;
  if (!raw) return res.status(400).json({ message: 'Faltan ingredientes en la consulta' });

  // Convertimos ingredientes ingresados por el usuario
  const ingredientes = raw
    .split(',')
    .map(i => i.trim().toLowerCase());

  try {
    // Creamos un array de condiciones tipo OR por cada ingrediente
    const condiciones = ingredientes.map(ing => ({
      "ingredientes.nombre": { 
        $regex: new RegExp(ing, "i")   // Coincidencia parcial y sin mayúsculas
      }
    }));

    // Buscamos recetas donde TODOS los ingredientes buscados estén presentes
    const recipes = await Recipe.find({
      $and: condiciones
    });

    res.json(recipes);

  } catch (err) {
    res.status(500).json({ message: 'Error en la búsqueda', error: err.message });
  }
});


//  Obtener todas las recetas solo si es admin
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const recetas = await Recipe.find();
    res.json(recetas);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener las recetas (admin)', error: err.message });
  }
});

// Agregar receta (solo admin)
router.post('/admin/add', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, ingredientes, instructions, image, category, dificultad } = req.body;

    // Validaciones básicas
    if (!title || !ingredientes || !instructions || !image || !category || !dificultad) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    if (!Array.isArray(ingredientes) || ingredientes.length === 0) {
      return res.status(400).json({ message: 'Debes agregar al menos un ingrediente' });
    }

    // Normalizar ingredientes
    const ingredientesLimpios = ingredientes.map(i => ({
      nombre: i.nombre ? i.nombre.trim().toLowerCase() : "",
      cantidad: i.cantidad ? i.cantidad.trim() : ""
    })).filter(i => i.nombre !== "");

    if (ingredientesLimpios.length === 0) {
      return res.status(400).json({ message: 'Los ingredientes no pueden estar vacíos' });
    }

    // Crear la receta final
    const newRecipe = new Recipe({
      title,
      ingredientes: ingredientesLimpios,
      instructions,
      image,
      category,
      dificultad
    });

    await newRecipe.save();

    res.status(201).json({
      message: 'Receta agregada correctamente',
      data: newRecipe
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar la receta', error: error.message });
  }
});


//  Modificar receta (solo admin)
router.put('/admin/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const receta = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!receta) return res.status(404).json({ message: 'Receta no encontrada' });

    res.json({
      message: 'Receta actualizada correctamente',
      data: receta
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar la receta', error: err.message });
  }
});

//  Eliminar receta (solo admin)
router.delete('/admin/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const receta = await Recipe.findByIdAndDelete(req.params.id);
    if (!receta) return res.status(404).json({ message: 'Receta no encontrada' });

    res.json({ message: 'Receta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar la receta', error: err.message });
  }
});

//  Obtener todas las recetas (público)
router.get('/', async (req, res) => {
  try {
    const recetas = await Recipe.find();
    res.json(recetas);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener las recetas', error: err.message });
  }
});

//  Obtener receta por ID (público)
router.get('/:id', async (req, res) => {
  try {
    const receta = await Recipe.findById(req.params.id);
    if (!receta) return res.status(404).json({ message: 'Receta no encontrada' });

    res.json(receta);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar la receta', error: err.message });
  }
});

module.exports = router;
