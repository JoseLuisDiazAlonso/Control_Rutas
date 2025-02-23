
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

const Formulario = ({ onSubmit }) => {
    const { register, handleSubmit, reset } = useForm();

    const handleFormSubmit = (data) => {
        onSubmit(data);
        reset(); //Esto limpia el formulario después de utilizarlo
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className='form-container'>
            <h1 className='form-title'>INFORMACIÓN DE RUTA</h1>
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
