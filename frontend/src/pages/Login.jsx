import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api'; // <--- Importa la URL base
import logoBN from '../assets/logobn-bg-blanco.png';

function Login({ setUsuario }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const res = await axios.post(`${API_URL}/api/usuarios/login`, {
        correo,
        password
      });

      const usuario = res.data;
      localStorage.setItem('usuario', JSON.stringify(usuario));
      setUsuario(usuario);
      // No haces navigate aquí, el App decide la ruta correcta

    } catch (error) {
      // Mensaje por defecto
      let msg = 'Correo o contraseña inválidos';

      // Si el backend responde con status o message, intentar detallar
      if (error.response) {
        const { status, data } = error.response;

        // Si el backend devuelve mensaje claro, usarlo (pero limpiarlo)
        if (data?.message && typeof data.message === 'string') {
          const text = data.message.toLowerCase();
          if (/correo|email|no existe|no registrado/.test(text)) {
            msg = 'Correo no registrado';
          } else if (/contraseñ|password|clave|credencial/.test(text)) {
            msg = 'Contraseña incorrecta';
          } else {
            // si el backend manda un mensaje legible, mostrarlo
            msg = data.message;
          }
        } else if (status === 404) {
          msg = 'Correo no registrado';
        } else if (status === 401) {
          msg = 'Contraseña incorrecta';
        } else {
          msg = 'Error del servidor. Intente más tarde.';
        }
      } else {
        // No hay respuesta (problema de red)
        msg = 'Error de red. Verifica tu conexión e inténtalo nuevamente.';
      }

      console.error('❌ Error al iniciar sesión:', error);
      setMensaje(msg);
    }
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '2.5rem 2rem',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        {/* Logo del Banco de la Nación */}
        <div className = "logoBN" style={{  textAlign: 'center' }}>
                <img src={logoBN} alt="Banco de la Nación" style={{ width: '300px', height: 'auto' }} />
        </div>
        <h2 style={{ color: '#D22630', fontWeight: 'bold', marginBottom: '1.5rem' }}>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Entrar</button>
          {mensaje && <p style={{ color: '#D22630', marginTop: '1rem', fontWeight: 'bold' }}>{mensaje}</p>}
        </form>
        <div style={{ marginTop: '1.5rem' }}>
          <button
            type="button"
            style={linkButtonStyle}
            onClick={() => navigate('/registro')}
          >
            ¿No tienes cuenta? <span style={{ color: '#D22630', fontWeight: 'bold' }}>Regístrate</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  marginBottom: '1rem',
  padding: '0.7rem',
  fontSize: '1rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  outline: 'none'
};

const buttonStyle = {
  width: '100%',
  padding: '0.8rem',
  backgroundColor: '#D22630',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '1rem',
  marginTop: '0.5rem'
};

const linkButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#333',
  fontWeight: 'normal',
  cursor: 'pointer',
  textDecoration: 'underline',
  fontSize: '1rem'
};

export default Login;