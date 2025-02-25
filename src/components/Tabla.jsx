import { useState } from "react";
import PropTypes from "prop-types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Legend } from "recharts";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const Tabla = ({ data, eliminarFila }) => {
    const [filtros, setFiltros] = useState({
        fecha: "",
        ruta: "",
        conductor: "",
        matricula: "",
        clientes: "",
        horaEntrada: "",
        horaSalida: ""
    });

    const [promedio, setPromedio] = useState(null);
    const [mostrarPromedio, setMostrarPromedio] = useState(false);

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const obtenerMesAnio = (fecha) => {
        if (!fecha) return "";
        const [anio, mes] = fecha.split("-");
        return `${anio}-${mes}`;
    };

    const handleFiltroChange = (e, key) => {
        setFiltros({
            ...filtros,
            [key]: e.target.value
        });
    };

    const calcularDiferenciaTiempo = (horaEntrada, horaSalida) => {
        if (!horaEntrada || !horaSalida) return 0;

        const [hEntrada, mEntrada] = horaEntrada.split(":").map(Number);
        const [hSalida, mSalida] = horaSalida.split(":").map(Number);

        const minutosEntrada = hEntrada * 60 + mEntrada;
        const minutosSalida = hSalida * 60 + mSalida;

        return minutosSalida > minutosEntrada ? minutosSalida - minutosEntrada : 0;
    };

    const datosFiltrados = data.filter((item) =>
        Object.keys(filtros).every((key) => {
            if (key === "fecha" && filtros[key]) {
                return obtenerMesAnio(item.fecha) === filtros[key];
            }
            return filtros[key] === "" || item[key] === filtros[key];
        })
    );

    const calcularPromedio = () => {
        if (datosFiltrados.length === 0) {
            setPromedio(null);
            setMostrarPromedio(false);
            return;
        }

        const totalTiempo = datosFiltrados.reduce((acc, item) => acc + calcularDiferenciaTiempo(item.horaEntrada, item.horaSalida), 0);
        const promedioCalculado = totalTiempo / datosFiltrados.length;

        setPromedio(promedioCalculado.toFixed(2));
        setMostrarPromedio(true);
    };

    const agruparDatosPorClienteYMes = () => {
        const groupedData = [];

        // Agrupar datos
        datosFiltrados.forEach(item => {
            const mes = obtenerMesAnio(item.fecha);
            const cliente = item.clientes;
            const tiempo = calcularDiferenciaTiempo(item.horaEntrada, item.horaSalida);

            const existingGroup = groupedData.find(group => group.mes === mes);

            if (existingGroup) {
                // Si ya existe el mes, agregar el cliente y su tiempo correspondiente
                if (!existingGroup[cliente]) {
                    existingGroup[cliente] = 0;
                }
                existingGroup[cliente] += tiempo;
            } else {
                // Si no existe, crear la entrada para el mes
                groupedData.push({
                    mes,
                    [cliente]: tiempo,
                });
            }
        });

        // Crear una lista para renderizar el gráfico con el tiempo promedio de cada cliente
        return groupedData.map(group => ({
            mes: group.mes,
            ...group,
        }));
    };

    const dataForChart = agruparDatosPorClienteYMes();

    // Generar una lista de colores para los clientes
    const colores = [
        "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#8dd1e1",
        "#d0ed57", "#8a4baf", "#f3a3a3", "#a57f9d"
    ];

    // Asignar un color único para cada cliente
    const asignarColorCliente = (cliente, index) => {
        return colores[index % colores.length];
    };

    // Función para exportar el gráfico a PDF
    const exportarPDF = () => {
        const input = document.getElementById('grafico'); // Obtener el contenedor del gráfico
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const doc = new jsPDF();
            doc.addImage(imgData, 'PNG', 10, 10, 180, 160); // Añadir imagen al PDF
            doc.save('grafico.pdf'); // Descargar PDF
        });
    };

    return (
        <div className="tabla-container">    
            <table className="tabla">
                <thead>
                    <tr>
                        {["Fecha", "Ruta", "Conductor", "Matrícula", "Clientes", "Hora Entrada", "Hora Salida", "Tiempo en Cliente", "Acciones"].map((header, index) => (
                            <th key={index}>
                                {header}
                                {index === 0 ? (
                                    <select className="select-filtro" onChange={(e) => handleFiltroChange(e, "fecha")}>
                                        <option value="">Todos los meses</option>
                                        {meses.map((mes, i) => {
                                            const mesIndex = (i + 1).toString().padStart(2, "0");
                                            const mesAnio = `2025-${mesIndex}`;
                                            return (
                                                <option key={i} value={mesAnio}>
                                                    {mes} 2025
                                                </option>
                                            );
                                        })}
                                    </select>
                                ) : index < 7 ? (
                                    <select className="select-filtro" onChange={(e) => handleFiltroChange(e, Object.keys(filtros)[index])}>
                                        <option value="">Todos</option>
                                        {[...new Set(data.map((item) => item[Object.keys(filtros)[index]]))].map((valor, i) => (
                                            <option key={i} value={valor}>
                                                {valor}
                                            </option>
                                        ))}
                                    </select>
                                ) : null}
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
                                <button className="boton-eliminar" onClick={() => eliminarFila(item.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="boton-calcular" onClick={calcularPromedio}>
                Calcular Tiempo Promedio
            </button>

            {mostrarPromedio && (
                <div className="tabla-promedio">
                    <h3>Resultados del Cálculo</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Ruta</th>
                                <th>Conductor</th>
                                <th>Matrícula</th>
                                <th>Clientes</th>
                                <th>Tiempo Promedio (min)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosFiltrados.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.fecha}</td>
                                    <td>{item.ruta}</td>
                                    <td>{item.conductor}</td>
                                    <td>{item.matricula}</td>
                                    <td>{item.clientes}</td>
                                    <td>{promedio}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button className="boton-eliminar" onClick={() => setMostrarPromedio(false)}>
                        Eliminar Segunda Tabla
                    </button>
                </div>
            )}

            {mostrarPromedio && (
                <div className="grafico-container" id="grafico">
                    <h3>Gráfico de Tiempo Promedio por Cliente y Mes</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dataForChart}>
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {Object.keys(dataForChart[0]).map((key, index) => key !== 'mes' && (
                                <Bar key={index} dataKey={key} name={key} fill={asignarColorCliente(key, index)}>
                                    <LabelList
                                        dataKey={key}
                                        position="top"
                                        fill="#000"
                                    />
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                    {/* Botón para exportar el gráfico */}
                    <button className="boton-exportar" onClick={exportarPDF}>
                        Exportar a PDF
                    </button>
                </div>
            )}
        </div>
    );
};

// ✅ PropTypes añadidos
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
