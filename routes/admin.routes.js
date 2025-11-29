const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const { verifyToken, verifyAdmin } = require('../controllers/auth.controller');

// 📊 Obtener estadísticas del dashboard admin
router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Total de usuarios
    const totalUsers = await User.countDocuments();

    // Usuarios con plan free
    const freeUsers = await User.countDocuments({ membership: 'free' });

    // Usuarios premium
    const premiumUsers = await User.countDocuments({ membership: 'premium' });

    // Total de recetas
    const totalRecipes = await Recipe.countDocuments();

    res.json({
      totalUsers,
      freeUsers,
      premiumUsers,
      totalRecipes
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

module.exports = router;
