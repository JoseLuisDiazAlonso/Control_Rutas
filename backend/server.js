import express from 'express';
import dotenv from 'dotenv';
import process from 'process';
import routes from './routes';

dotenv.config();  // Cargar las variables de entorno

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());  // Middleware para poder recibir JSON en las solicitudes

// Usar las rutas
app.use('/api', routes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${port}`);
});