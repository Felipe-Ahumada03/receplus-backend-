const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Cargar variables del .env
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Conectado a MongoDB Atlas');
}).catch((err) => {
  console.error('❌ Error al conectar a MongoDB:', err.message);
});

// --- RUTAS ---
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes')); // Asumo que tienes este archivo
app.use('/api/recipes', require('./routes/recipe.routes'));

// ✅ RUTA DE PAYPAL (Esta es la importante para lo que estamos haciendo)
app.use('/api/paypal', require('./routes/paypal.routes'));

app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/preferences', require('./routes/preference.routes'));

// Arranque del servidor
// Nota: Tu .env tiene PORT=3000, así que el servidor usará el puerto 3000.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});