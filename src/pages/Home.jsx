import { useNavigate } from "react-router-dom";
import Formulario from "../components/Formulario";
import Tabla from "../components/Tabla";
import Graficos from "../components/Graficos";
import ExportarImportar from "../components/ExportarImportar";
import { useEffect, useState } from "react";


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

  return (
    <div className="container">
      <aside className="sidebar">
        <Formulario onSubmit={(entry) => setData([...data, { id: Date.now(), ...entry }])} />
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