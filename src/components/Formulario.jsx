import { useState } from 'react';  // Solo importamos `useState`
import axios from 'axios';

const Formulario = () => {
  // Estados para los campos del formulario
  const [ruta, setRuta] = useState('');
  const [conductor, setConductor] = useState('');
  const [clientes, setClientes] = useState('');
  const [horaEntrada, setHoraEntrada] = useState('');
  const [horaSalida, setHoraSalida] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear un objeto con los datos del formulario
    const nuevoRegistro = {
      ruta,
      conductor,
      clientes,
      horaEntrada,
      horaSalida
    };

    try {
      // Enviar los datos al backend usando Axios
      const respuesta = await axios.post('http://localhost:5000/api/registros', nuevoRegistro);

      // Mostrar mensaje de éxito usando la respuesta del backend
      setMensaje(respuesta.data.message);

      // Limpiar el formulario después de guardar
      setRuta('');
      setConductor('');
      setClientes('');
      setHoraEntrada('');
      setHoraSalida('');
    } catch (error) {
      console.error(error);
      setMensaje('Error al guardar el registro');
    }
  };

  return (
    <div>
      <h2>Formulario de Registro</h2>
      {mensaje && <p>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ruta:</label>
          <input
            type="text"
            value={ruta}
            onChange={(e) => setRuta(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Conductor:</label>
          <input
            type="text"
            value={conductor}
            onChange={(e) => setConductor(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Clientes:</label>
          <input
            type="number"
            value={clientes}
            onChange={(e) => setClientes(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Hora de Entrada:</label>
          <input
            type="datetime-local"
            value={horaEntrada}
            onChange={(e) => setHoraEntrada(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Hora de Salida:</label>
          <input
            type="datetime-local"
            value={horaSalida}
            onChange={(e) => setHoraSalida(e.target.value)}
            required
          />
        </div>
        <button type="submit">Guardar Registro</button>
      </form>
    </div>
  );
};

export default Formulario;
