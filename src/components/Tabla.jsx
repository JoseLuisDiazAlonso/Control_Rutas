import { useState } from "react";
import PropTypes from "prop-types";

const Tabla = ({ data, eliminarFila }) => {
    const [filtros, setFiltros] = useState({
        fecha: "", // Este filtro ahora será un mes (formato 'YYYY-MM')
        ruta: "",
        conductor: "",
        matricula: "",
        clientes: "",
        horaEntrada: "",
        horaSalida: ""
    });

    // Función para obtener valores únicos de las columnas
    const obtenerValoresUnicos = (columna) => {
        return ["", ...new Set(data.map((item) => item[columna]))];
    };

    // Función para manejar el cambio en los filtros
    const handleFiltroChange = (e, key) => {
        setFiltros({
            ...filtros,
            [key]: e.target.value
        });
    };

    // Función para calcular la diferencia de tiempo en minutos
    const calcularDiferenciaTiempo = (horaEntrada, horaSalida) => {
        if (!horaEntrada || !horaSalida) return 0; // Evitar errores si los valores son null

        const [hEntrada, mEntrada] = horaEntrada.split(":").map(Number);
        const [hSalida, mSalida] = horaSalida.split(":").map(Number);

        // Convertir las horas a minutos
        const minutosEntrada = hEntrada * 60 + mEntrada;
        const minutosSalida = hSalida * 60 + mSalida;

        // Calcular la diferencia en minutos
        const diferencia = minutosSalida - minutosEntrada;

        return diferencia > 0 ? diferencia : 0; // Asegurar que no sea negativo
    };

    // Función para extraer el mes y el año de la fecha (Formato YYYY-MM)
    const obtenerMesAnio = (fecha) => {
        const [anio, mes] = fecha.split("-"); // Suponiendo que la fecha tiene formato YYYY-MM-DD
        return `${anio}-${mes}`; // Formato YYYY-MM
    };

    // Filtrado de los datos
    const datosFiltrados = data.filter((item) =>
        Object.keys(filtros).every((key) => {
            if (key === "fecha" && filtros[key]) {
                return obtenerMesAnio(item[key]) === filtros[key]; // Filtrar por mes y año
            }
            return filtros[key] === "" || item[key] === filtros[key];
        })
    );

    // Lista de meses para el filtro de fecha
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    return (
        <div className="tabla-container">
            <table className="tabla">
                <thead>
                    <tr>
                        {["Fecha", "Ruta", "Conductor", "Matrícula", "Clientes", "Hora Entrada", "Hora Salida", "Tiempo en Cliente", "Acciones"].map((header, index) => (
                            <th key={index}>
                                {header}
                                {index < 7 && (
                                    <select
                                        className="select-filtro"
                                        onChange={(e) => handleFiltroChange(e, Object.keys(filtros)[index])}
                                    >
                                        {index === 0 ? (
                                            // Filtro para la columna Fecha con selección de meses
                                            <>
                                                <option value="">Todos los meses</option>
                                                {meses.map((mes, i) => {
                                                    const mesIndex = i + 1; // 1 a 12
                                                    const mesFormateado = mesIndex < 10 ? `0${mesIndex}` : mesIndex;
                                                    const mesAnio = `2025-${mesFormateado}`; // Aquí asumimos que todos los datos corresponden al mismo año
                                                    return (
                                                        <option key={i} value={mesAnio}>
                                                            {mes}
                                                        </option>
                                                    );
                                                })}
                                            </>
                                        ) : (
                                            // Filtros normales
                                            obtenerValoresUnicos(Object.keys(filtros)[index]).map((valor, i) => (
                                                <option key={i} value={valor}>
                                                    {valor === "" ? "Todos" : valor}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {datosFiltrados.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? "fila-par" : "fila-impar"}>
                            <td>{item.fecha}</td>
                            <td>{item.ruta}</td>
                            <td>{item.conductor}</td>
                            <td>{item.matricula}</td>
                            <td>{item.clientes}</td>
                            <td>{item.horaEntrada}</td>
                            <td>{item.horaSalida}</td>
                            <td>{calcularDiferenciaTiempo(item.horaEntrada, item.horaSalida)} min</td>
                            <td>
                                <button className="boton-eliminar" onClick={() => eliminarFila(item.id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// PropTypes
Tabla.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            fecha: PropTypes.string.isRequired,
            ruta: PropTypes.string.isRequired,
            conductor: PropTypes.string.isRequired,
            matricula: PropTypes.string.isRequired,
            clientes: PropTypes.string.isRequired,
            horaEntrada: PropTypes.string.isRequired,
            horaSalida: PropTypes.string.isRequired
        })
    ).isRequired,
    eliminarFila: PropTypes.func.isRequired
};

export default Tabla;
