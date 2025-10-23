const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


// Cargar variables del .env
dotenv.config();

const app = express();
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

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/recipes', require('./routes/recipe.routes'));
app.use('/api/paypal', require('./routes/paypal.routes'));
const contactRoutes = require('./routes/contact.routes');
app.use('/api/contact', contactRoutes);
const preferenceRoutes = require('./routes/preference.routes');
app.use('/api/preferences', preferenceRoutes);


// Arranque del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
