// routes.js
import express from 'express';
import connection from './db';  // Importa la conexión a la base de datos

const router = express.Router();

// Endpoint para obtener datos
router.get('/datos', (req, res) => {
  // Realizamos una consulta SQL
  const query = 'SELECT * FROM registros';  

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al consultar los datos:', err);
      return res.status(500).json({ message: 'Error al obtener los datos' });
    }
    res.json(results);  // Devolver los resultados de la consulta
  });
});

// Endpoint para insertar datos
router.post('/datos', (req, res) => {
  const { nombre, edad } = req.body;  // Suponiendo que envías un cuerpo con estos datos

  // Consulta SQL para insertar datos
  const query = 'INSERT INTO tabla_datos (nombre, edad) VALUES (?, ?)';
  
  connection.query(query, [nombre, edad], (err) => {
    if (err) {
      console.error('Error al insertar los datos:', err);
      return res.status(500).json({ message: 'Error al insertar los datos' });
    }
    res.status(201).json({ message: 'Datos insertados correctamente' });
  });
});

export default router;  // Exportar las rutas
