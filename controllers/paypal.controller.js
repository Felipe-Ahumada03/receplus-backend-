const User = require('../models/User'); // asegúrate de tener el modelo de usuario importado

app.post('/api/paypal/confirm', async (req, res) => {
  const { userId, paymentId } = req.body;

  try {
    // Aquí puedes verificar el estado del pago con la API de PayPal si lo deseas

    // Actualizar la membresía del usuario a 'premium'
    await User.findByIdAndUpdate(userId, { membership: 'premium' });

    res.json({ message: 'Membresía actualizada a premium correctamente.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar la membresía.' });
  }
});
