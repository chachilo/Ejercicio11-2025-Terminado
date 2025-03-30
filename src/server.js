const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Conectar a la base de datos
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/no035DB';
mongoose.connect(mongoURI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Middleware
app.use(cors());
app.use(express.json());

app.use(cors({
  origin: 'http://127.0.0.1:5500', // o el puerto de tu frontend
  methods: ['GET', 'POST']
}));

// Rutas
const respuestaRoutes = require('./routes/respuestaRoutes');
const empresaRoutes = require('./routes/empresaRoutes');

// Configuración correcta de los prefijos
app.use('/api/empresas', empresaRoutes); // Cambiado a plural para consistencia
app.use('/api/respuestas', respuestaRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Encuestas SST');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});