const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const User = require('../models/User');

// Configurar el cliente de PayPal con credenciales desde .env
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// Crear orden de pago
router.post('/create-order', async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'MXN',
        value: '.10',
      }
    }]
  });

  try {
    const order = await client.execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    console.error('❌ Error al crear la orden:', err);
    res.status(500).json({ message: 'Error al crear orden' });
  }
});

// Activar membresía después del pago exitoso
router.post('/set-membership', async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { membership: 'premium' }, { new: true });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ message: 'Membresía actualizada a premium', user });
  } catch (err) {
    console.error('❌ Error al actualizar membresía:', err);
    res.status(500).json({ message: 'Error al actualizar membresía' });
  }
});

module.exports = router;
