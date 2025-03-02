import express from 'express';
import Registro from './models/Registro.js'; // Importar el modelo Registro

const router = express.Router();

// Obtener todos los registros
router.get('/api/registros', async (req, res) => {
  try {
    const registros = await Registro.find(); // Obtener los registros de la base de datos
    res.json(registros); // Enviar la respuesta con los registros
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un nuevo registro
router.post('/api/registros', async (req, res) => {
  const { ruta, conductor, clientes, horaEntrada, horaSalida } = req.body;

  const nuevoRegistro = new Registro({
    ruta,
    conductor,
    clientes,
    horaEntrada,
    horaSalida,
  });

  try {
    await nuevoRegistro.save(); // Guardar el nuevo registro
    res.status(201).json(nuevoRegistro); // Enviar la respuesta con el nuevo registro creado
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;




