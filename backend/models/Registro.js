import mongoose from 'mongoose';

// Definir el esquema para los registros
const registroSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  ruta: String,
  conductor: String,
  clientes: Text,
  horaEntrada: Date,
  horaSalida: Date
});

// Crear el modelo a partir del esquema
const Registro = mongoose.model('Registro', registroSchema);

// Exportar el modelo para usarlo en otros archivos
export default Registro;
