
import {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import userImage from "../assets/Logo personal.png";
import '../css/Style.css';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate("");

    //Cargamos los credenciales almacenadas al iniciar.
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        const storedPassword = localStorage.getItem("password");
        if (storedUsername && storedPassword) {
            setUsername(storedUsername);
            setPassword(storedPassword);
                setUsername(storedUsername);
                setPassword(storedPassword);
            }
        }, []);

    //Hacemos la comprobación de los datos introducidos en el login.

    const handleLogin = () => {
        setError(""); //Reinicia errores
        if (!username || !password) {
            setError("Los campos deben de estar rellenos");
            return;
           }
           if (!/^[a-zA-Z]+$/.test(username)) {
            setError("El nombre de usuario solo puede tener texto.");
            return;
           }
        
           //Guardamos los credenciales el localStorage
        
           localStorage.setItem("username", username);
           localStorage.setItem("password", password);
        
           //Simulación de autentificación
        
           if (username === "Atreva" && password === "Control2025?") {
            navigate ("/Home") //Redirige a la página principal.
           } else {
            setError ("Usuario o contraseña incorrectos.");
           }
    };
   
  return (
    <div className='container'>
        <div className='formulario'>
            <img src={userImage}
            alt='Usuario'
            className='logo'/>
            <h2>LOGIN</h2>
            {error && <p>{error}</p>}
            <input type='text' placeholder='Nombre de Usuario' className='input'
            value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input type='password' placeholder='Contraseña' className='input'
            value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button className='boton' onClick={handleLogin}>Login</button>
        </div>
      
    </div>
  )
}

export default Login
