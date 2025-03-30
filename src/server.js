const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Conectar a la base de datos
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/nom035DB';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const respuestaRoutes = require('./routes/respuestaRoutes');
app.use('/api/respuestas', respuestaRoutes);

const empresaRoutes = require('./routes/empresaRoutes');
app.use('/api/empresa', empresaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});