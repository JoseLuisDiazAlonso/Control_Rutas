import { useNavigate } from "react-router-dom";
import Formulario from "../components/Formulario";
import Tabla from "../components/Tabla";
import Graficos from "../components/Graficos";
import ExportarImportar from "../components/ExportarImportar";
import { useEffect, useState } from "react";
import axios from "axios";


const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(JSON.parse(localStorage.getItem("rutas")) || []);

  useEffect(() => {
    localStorage.setItem("rutas", JSON.stringify(data));
  }, [data]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    navigate("/");
  };

  // Función para guardar los datos en la base de datos
  const guardarDatosEnBaseDeDatos = async (entry) => {
    try {
      // Aquí hacemos la solicitud POST al servidor para guardar los datos
      const response = await axios.post("http://195.35.48.41/guardar-datos", entry);
      
      // Si la respuesta es exitosa, puedes agregar el nuevo dato al estado
      console.log("Datos guardados correctamente:", response.data);
      setData([...data, { id: Date.now(), ...entry }]); // Aquí añadimos el dato al estado
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