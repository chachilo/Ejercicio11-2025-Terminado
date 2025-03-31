const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuración mejorada de CORS
const corsOptions = {
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'], // Ambos posibles orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions)); // Aplicar configuración CORS una sola vez
app.use(express.json()); // Para parsear application/json
app.use(express.urlencoded({ extended: true })); // Para parsear application/x-www-form-urlencoded

// Conexión a MongoDB con configuración mejorada
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/no035DB';
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000, // Tiempo de espera para conexión
  socketTimeoutMS: 45000 // Tiempo de espera para operaciones
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => {
  console.error('❌ Error al conectar a MongoDB:', err.message);
  process.exit(1); // Salir si no hay conexión a la DB
});

// Manejo de eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado a la DB');
});

mongoose.connection.on('error', (err) => {
  console.error('Error de conexión de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado');
});

// Importar rutas
const respuestaRoutes = require('./routes/respuestaRoutes');
const empresaRoutes = require('./routes/empresaRoutes');

// Configuración de rutas
app.use('/api/empresas', empresaRoutes);
app.use('/api/respuestas', respuestaRoutes);

// Middleware para manejar errores 404
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false,
    error: 'Endpoint no encontrado' 
  });
});

// Middleware para manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error('Error del servidor:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de cierre adecuado
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose desconectado por terminación de la aplicación');
    server.close(() => {
      console.log('Servidor cerrado');
      process.exit(0);
    });
  });
});