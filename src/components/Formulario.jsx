import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';

const Formulario = ({ onSubmit }) => {
    const { register, handleSubmit, reset } = useForm();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [insertedId, setInsertedId] = useState(null);  // Nuevo estado para almacenar el ID insertado

    const handleFormSubmit = async (data) => {
        try {
            // Enviar los datos al servidor usando Axios en lugar de fetch
            const response = await axios.post('http://195.35.48.41/api/datos', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Si la respuesta es exitosa, establecemos éxito
            setSuccess(true);
            setError(null);  // Limpiar cualquier error anterior

            // Usamos result.insertId para obtener el ID insertado
            setInsertedId(response.data.id);  // Almacenar el ID insertado en el estado

            // Llamamos a la función onSubmit si es necesario
            onSubmit(data);

            reset();  // Limpiar el formulario

        } catch (err) {
            // Si hay un error, lo capturamos
            setError(err.response ? err.response.data.message : 'Error al guardar los datos');
            setSuccess(false);  // Si ocurre un error, establecemos éxito en false
            setInsertedId(null);  // Limpiar el ID insertado
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className='form-container'>
            <h1 className='form-title'>INFORMACIÓN DE RUTA</h1>

            {error && <p className="error-message">{error}</p>} {/* Mostrar el error */}
            {success && (
                <div>
                    <p className="success-message">¡Datos guardados exitosamente!</p>
                    {insertedId && <p className="success-message">ID del registro insertado: {insertedId}</p>} {/* Mostrar el ID del registro insertado */}
                </div>
            )} {/* Mostrar éxito */}

            <label>Fecha</label>
            <input {...register("fecha")} type='date' required className='input-field' />

            <input {...register("ruta")} type='text' placeholder='Ruta' required className='input-field' />
            <input {...register("conductor")} type='text' placeholder='Conductor' required className='input-field' />
            <input {...register("matricula")} type='text' placeholder='Matrícula' required className='input-field' />
            <input {...register("clientes")} type='text' placeholder='Cliente' required className='input-field' />

            <label>Hora de Entrada</label>
            <input {...register("horaEntrada")} type="time" className='input-field' required />
            <label>Hora de Salida</label>
            <input {...register("horaSalida")} type="time" className='input-field' required />

            <button type='submit' className='submit-button'>Agregar</button>
        </form>
    );
};

Formulario.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default Formulario;
