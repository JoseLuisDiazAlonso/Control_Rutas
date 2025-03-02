import { useNavigate } from "react-router-dom";
import Formulario from "../components/Formulario";
import Tabla from "../components/Tabla";
import Graficos from "../components/Graficos";
import ExportarImportar from "../components/ExportarImportar";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Obtener los datos de la base de datos al cargar la página
    const obtenerDatos = async () => {
      try {
        const response = await axios.get("http://195.35.48.41/api/datos");
        setData(response.data); // Actualizamos el estado con los datos obtenidos de MongoDB
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    obtenerDatos();
  }, []); // Este useEffect se ejecutará solo una vez al cargar la página

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    navigate("/");
  };

  // Función para guardar los datos en MongoDB
  const guardarDatosEnBaseDeDatos = async (entry) => {
    try {
      // Realizar la solicitud POST para guardar los datos en MongoDB
      const response = await axios.post("http://195.35.48.41/api/guardar-datos", entry);
      
      // Si la respuesta es exitosa, puedes agregar el nuevo dato al estado
      console.log("Datos guardados correctamente:", response.data);
      setData([...data, response.data]); // Aquí añadimos el nuevo dato al estado con los datos devueltos por el servidor
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <Formulario onSubmit={(entry) => guardarDatosEnBaseDeDatos(entry)} />
      </aside>
      <main className="content">
        {/* Solo el componente ExportarImportar debajo de la tabla */}
        <div className="tabla-container">
          <Tabla data={data} eliminarFila={(id) => setData(data.filter((item) => item.id !== id))} />
          <ExportarImportar data={data} setData={setData} />
        </div>

        {/* Componente de gráficos */}
        <Graficos data={data} />

        {/* Botón para cerrar sesión */}
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </main>
    </div>
  );
};

export default Home;
