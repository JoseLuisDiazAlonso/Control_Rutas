import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();  // Cargar variables de entorno desde .env

const app = express();
app.use(cors());
app.use(express.json());  // Para que Express pueda leer datos en formato JSON

// Conexión con la base de datos MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err);
        return;
    }
    console.log('✅ Conectado a MySQL');
});

// Endpoint para guardar los datos
app.post('/api/datos', (req, res) => {
    const { fecha, ruta, conductor, matricula, clientes, horaEntrada, horaSalida } = req.body;
    const sql = "INSERT INTO registros (fecha, ruta, conductor, matricula, clientes, horaEntrada, horaSalida) VALUES (?, ?, ?, ?, ?, ?, ?)";

    db.query(sql, [fecha, ruta, conductor, matricula, clientes, horaEntrada, horaSalida], (err, result) => {
        if (err) {
            console.error('❌ Error al guardar datos:', err);
            res.status(500).json({ error: "Error al guardar datos en la base de datos" });
        } else {
            res.status(201).json({ message: "✅ Datos guardados correctamente", id: result.insertId });
        }
    });
});

// Configuración del puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});