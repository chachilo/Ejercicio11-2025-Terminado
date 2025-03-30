const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log('Conexión a MongoDB establecida');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Detener la aplicación si no se puede conectar a la base de datos
  }
};

module.exports = connectDB;