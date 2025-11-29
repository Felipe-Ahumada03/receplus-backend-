const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.get('/check-membership', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token requerido' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    res.json({ membership: user.membership });
  } catch (err) {
    res.status(500).json({ message: 'Error al verificar membresía', error: err.message });
  }
});

// Obtener todos los usuarios registrados
router.get('/', async (req, res) => {
  try {
    const usuarios = await User.find({}, '-password'); // Excluye el campo password
    res.json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

module.exports = router;
