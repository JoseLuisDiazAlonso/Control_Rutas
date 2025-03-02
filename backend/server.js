import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'process';
import routes from './routes.js'; // Importar las rutas desde routes.js

// Configurar dotenv para cargar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();

// Usar middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.log('Error al conectar con MongoDB', err));

// Usar las rutas definidas en routes.js
app.use('/', routes); // Esto va a hacer que las rutas de /api/registros se gestionen con el enrutador de routes.js

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
});
