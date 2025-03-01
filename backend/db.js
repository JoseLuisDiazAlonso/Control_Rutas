import mysql from 'mysql2';
import dotenv from 'dotenv';
import process from 'process';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Crear la conexión
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'tu_usuario',
  password: process.env.DB_PASSWORD || 'tu_contraseña',
  database: process.env.DB_NAME || 'tu_base_de_datos',
  port: process.env.DB_PORT || 3306
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos con ID ' + connection.threadId);
});

export default connection;  // Exporta la conexión para usarla en otras partes del código
