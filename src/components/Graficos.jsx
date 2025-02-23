import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import PropTypes from "prop-types";
import { jsPDF } from "jspdf"; // Importamos jsPDF
import html2canvas from "html2canvas"; // Para capturar el gráfico como una imagen

// Función para calcular la diferencia de tiempo en minutos
const calcularDiferenciaTiempo = (horaEntrada, horaSalida) => {
    if (!horaEntrada || !horaSalida) return 0; // Evitar NaN

    const [hEntrada, mEntrada] = horaEntrada.split(":").map(Number);
    const [hSalida, mSalida] = horaSalida.split(":").map(Number);

    const minutosEntrada = hEntrada * 60 + mEntrada;
    const minutosSalida = hSalida * 60 + mSalida;

    return Math.max(minutosSalida - minutosEntrada, 0); // Asegura que no sea negativo
};

// Función para generar colores aleatorios
const generarColorAleatorio = () => {
    const letras = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letras[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Función para extraer el mes de la fecha (Formato YYYY-MM)
const obtenerMesAnio = (fecha) => {
    const [anio, mes] = fecha.split("-"); // Suponiendo que la fecha tiene formato YYYY-MM-DD
    return `${mes}-${anio}`; // Formato MM-YYYY
};

const Graficos = ({ data }) => {
    // Estados para los filtros
    const [filtroConductor, setFiltroConductor] = useState('');
    const [filtroRuta, setFiltroRuta] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('');
    const [filtroCliente, setFiltroCliente] = useState('');

    // Función para obtener los meses únicos
    const obtenerMesesUnicos = () => {
        const meses = data.map(item => obtenerMesAnio(item.fecha));
        return ["", ...new Set(meses)]; // Incluimos un valor vacío para "todos los meses"
    };

    // Función para agrupar los datos por conductor, cliente y calcular el tiempo promedio
    const procesarDatos = () => {
        const agrupado = data.reduce((acc, item) => {
            // Aplica los filtros
            const cumpleFiltroConductor = filtroConductor ? item.conductor === filtroConductor : true;
            const cumpleFiltroRuta = filtroRuta ? item.ruta === filtroRuta : true;
            const cumpleFiltroFecha = filtroFecha ? obtenerMesAnio(item.fecha) === filtroFecha : true;
            const cumpleFiltroCliente = filtroCliente ? item.clientes === filtroCliente : true;

            // Solo procesamos el dato si cumple con todos los filtros
            if (cumpleFiltroConductor && cumpleFiltroRuta && cumpleFiltroFecha && cumpleFiltroCliente) {
                const key = `${item.conductor}-${item.clientes}`; // Combina conductor y cliente como clave
                if (!acc[key]) {
                    acc[key] = { totalTiempo: 0, cantidad: 0 }; // Inicializar con tiempo 0 y cantidad 0
                }
                // Sumar el tiempo en cliente
                acc[key].totalTiempo += calcularDiferenciaTiempo(item.horaEntrada, item.horaSalida);
                acc[key].cantidad += 1; // Aumentar la cantidad de registros para este conductor-cliente
            }
            return acc;
        }, {});

        // Convertir el objeto agrupado en un array con el tiempo promedio
        return Object.entries(agrupado).map(([key, { totalTiempo, cantidad }]) => {
            const [conductor, cliente] = key.split('-');
            const tiempoPromedio = totalTiempo / cantidad; // Calcular el tiempo promedio
            return { conductor, cliente, tiempoPromedio };
        });
    };

    // Procesar los datos
    const datosPromedio = procesarDatos();

    // Función para exportar el gráfico a PDF
    const exportarPdf = () => {
        const input = document.getElementById("graficos-container");

        html2canvas(input, {
            scale: 2, // Aumentamos la calidad de la imagen
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const doc = new jsPDF();

            // Añadir la imagen del gráfico al PDF
            doc.addImage(imgData, "PNG", 10, 10, 180, 160); // Puedes ajustar las coordenadas y el tamaño de la imagen
            doc.save("grafico.pdf");
        });
    };

    return (
        <div className="graficos-container" id="graficos-container">
            <h2>Filtros</h2>
            <div>
                <label>Conductor:</label>
                <select onChange={(e) => setFiltroConductor(e.target.value)} value={filtroConductor}>
                    <option value="">Todos los conductores</option>
                    {Array.from(new Set(data.map(item => item.conductor))).map((conductor) => (
                        <option key={conductor} value={conductor}>{conductor}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Ruta:</label>
                <select onChange={(e) => setFiltroRuta(e.target.value)} value={filtroRuta}>
                    <option value="">Todas las rutas</option>
                    {Array.from(new Set(data.map(item => item.ruta))).map((ruta) => (
                        <option key={ruta} value={ruta}>{ruta}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Mes:</label>
                <select onChange={(e) => setFiltroFecha(e.target.value)} value={filtroFecha}>
                    <option value="">Todos los meses</option>
                    {obtenerMesesUnicos().map((mes) => (
                        <option key={mes} value={mes}>
                            {mes ? `${mes.split('-')[0]} ${mes.split('-')[1]}` : 'Todos los meses'}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Cliente:</label>
                <select onChange={(e) => setFiltroCliente(e.target.value)} value={filtroCliente}>
                    <option value="">Todos los clientes</option>
                    {Array.from(new Set(data.map(item => item.clientes))).map((cliente) => (
                        <option key={cliente} value={cliente}>{cliente}</option>
                    ))}
                </select>
            </div>

            <h2>Tiempo Promedio dedicado por conductor a cada cliente</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosPromedio}>
                    <XAxis dataKey="conductor" />
                    <YAxis type="number" />
                    <Tooltip formatter={(value, name) => `${name}: ${value} minutos`} />
                    <Legend />
                    {datosPromedio.map((item) => (
                        <Bar
                            key={item.conductor + item.cliente}
                            dataKey="tiempoPromedio"
                            fill={generarColorAleatorio()} // Generamos un color aleatorio para cada barra
                            barSize={30}
                            name={`${item.conductor} - ${item.cliente}`}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>

            {/* Botón para exportar a PDF */}
            <button onClick={exportarPdf} className="export-pdf-button">
                Exportar a PDF
            </button>
        </div>
    );
};

// Definir PropTypes para validar las props
Graficos.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        fecha: PropTypes.string.isRequired,
        ruta: PropTypes.string.isRequired,
        conductor: PropTypes.string.isRequired,
        matricula: PropTypes.string.isRequired,
        clientes: PropTypes.string.isRequired,
        horaEntrada: PropTypes.string.isRequired,
        horaSalida: PropTypes.string.isRequired,
        tiempoEnCliente: PropTypes.number.isRequired
    })).isRequired,
};

export default Graficos;
