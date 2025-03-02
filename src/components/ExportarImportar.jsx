import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ExportarImportar = ({ data, setData }) => {
    // Función para exportar los datos a un archivo Excel
    const exportarExcell = () => {
        if (!data || data.length === 0) {
            alert("No hay datos para exportar.");
            return;
        }
        const ws = XLSX.utils.json_to_sheet(data); // Convertir los datos a hoja de Excel
        const wb = XLSX.utils.book_new();  // Crear un nuevo libro de Excel
        XLSX.utils.book_append_sheet(wb, ws, "Rutas");  // Agregar la hoja al libro
        XLSX.writeFile(wb, "control_rutas.xlsx");  // Descargar el archivo Excel
    };

    // Función para importar datos desde un archivo Excel
    const importarExcell = (event) => {
        const file = event.target.files[0];  // Obtener el archivo
        if (!file) return;

        const reader = new FileReader();  // Crear un lector de archivos
        reader.onload = async (e) => {
            const workbook = XLSX.read(e.target.result, { type: "binary" });  // Leer el archivo Excel
            const sheet = workbook.Sheets[workbook.SheetNames[0]];  // Obtener la primera hoja
            const importedData = XLSX.utils.sheet_to_json(sheet);  // Convertir la hoja a JSON
            setData(importedData);  // Actualizar el estado con los datos importados
            localStorage.setItem("rutas", JSON.stringify(importedData));  // Guardar los datos en el almacenamiento local

            // Enviar los datos importados al servidor (MongoDB)
            try {
                const response = await axios.post("http://localhost:5000/api/datos", importedData);  // Enviar los datos al servidor
                console.log("Datos importados y guardados correctamente:", response.data);  // Confirmación de éxito
            } catch (error) {
                console.error("Error al importar los datos:", error);  // Manejo de errores
            }
        };
        reader.readAsBinaryString(file);  // Leer el archivo como binario
    };

    return (
        <div>
            {/* Botón para exportar los datos a Excel */}
            <button className='export-button' onClick={exportarExcell}>
                Exportar a Excel
            </button>

            {/* Input para importar los datos desde un archivo Excel */}
            <input 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={importarExcell} 
            />
        </div>
    );
};

// Validaciones de los props
ExportarImportar.propTypes = {
    data: PropTypes.array.isRequired,  // Aseguramos que `data` sea un array
    setData: PropTypes.func.isRequired  // Aseguramos que `setData` sea una función
};

export default ExportarImportar;
