const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');


router.post('/', async (req, res) => {
    try {
      const nuevoMensaje = new Contact(req.body);
      await nuevoMensaje.save();
      res.status(201).json({ message: 'Mensaje guardado correctamente' });
    } catch (err) {
      console.error('Error al guardar contacto:', err);
      res.status(500).json({ message: 'Error al guardar contacto' });
    }
  });

  // Obtener todos los mensajes de contacto
router.get('/', async (req, res) => {
    try {
      const mensajes = await Contact.find().sort({ fecha: -1 }); // ordenados por fecha descendente
      res.json(mensajes);
    } catch (err) {
      console.error('Error al obtener mensajes:', err);
      res.status(500).json({ message: 'Error al obtener los mensajes' });
    }
  });
module.exports = router;
