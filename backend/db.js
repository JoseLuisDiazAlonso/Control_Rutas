// db.js
import mongoose from 'mongoose';
import process from 'process';

const conectarDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/heimdall', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión a MongoDB exitosa');
  } catch (error) {
    console.error('Error al conectar con MongoDB', error);
    process.exit(1); // Salir si no se puede conectar
  }
};

export default conectarDB;
