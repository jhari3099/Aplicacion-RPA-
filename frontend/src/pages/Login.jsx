// ...existing code...
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

  const isValidEmail = (e) => /\S+@\S+\.\S+/.test(e);

  // checkEmailExists mejorado: intenta 2 endpoints y logea respuestas para depuración
  const checkEmailExists = async () => {
    if (!isValidEmail(correo)) return null; // no intentar si email no es válido
    try {
      console.log('[AUTH] checkEmailExists: probando /api/usuarios?correo=...');
      const res = await axios.get(`${API_URL}/api/usuarios?correo=${encodeURIComponent(correo)}`);
      console.log('[AUTH] checkEmailExists response (query):', res.status, res.data);
      if (Array.isArray(res.data)) return res.data.length > 0;
      if (res.data && Object.keys(res.data).length > 0) return true;
    } catch (err) {
      console.warn('[AUTH] checkEmailExists (query) error:', err.response?.status, err.response?.data);
      // intentar endpoint alternativo si existe
      try {
        console.log('[AUTH] checkEmailExists: probando /api/usuarios/email/:correo ...');
        const res2 = await axios.get(`${API_URL}/api/usuarios/email/${encodeURIComponent(correo)}`);
        console.log('[AUTH] checkEmailExists response (email):', res2.status, res2.data);
        if (Array.isArray(res2.data)) return res2.data.length > 0;
        if (res2.data && Object.keys(res2.data).length > 0) return true;
      } catch (err2) {
        console.warn('[AUTH] checkEmailExists (email) error:', err2.response?.status, err2.response?.data);
        // Si el servidor responde 404 en cualquiera, interpretamos como "no existe"
        if (err.response?.status === 404 || err2.response?.status === 404) return false;
        // Si no se puede determinar (error de red o 401), devolver null
        return null;
      }
    }
    return false;
  };

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
      // navegar o actualizar estado según tu app
    } catch (error) {
      console.error('[AUTH] login error:', error.response?.status, error.response?.data);
      let msg = 'Correo o contraseña inválidos';

      if (error.response) {
        const { status, data } = error.response;

        // Si backend ya envía message claro, usarlo
        if (data?.message && typeof data.message === 'string') {
          const text = data.message.toLowerCase();
          if (/correo|email|no existe|no registrado/.test(text)) {
            setMensaje('Correo no registrado');
            return;
          }
          if (/contraseñ|password|clave|credencial/.test(text)) {
            setMensaje('Contraseña incorrecta');
            return;
          }
        }

        if (status === 404) {
          setMensaje('Correo no registrado');
          return;
        }

        if (status === 401) {
          // Intentar diferenciar preguntando existencia del email
          const exists = await checkEmailExists();
          console.log('[AUTH] exists:', exists);
          if (exists === true) {
            setMensaje('Contraseña incorrecta');
            return;
          } else if (exists === false) {
            setMensaje('Correo no registrado');
            return;
          } else {
            // null -> no se pudo determinar
            setMensaje('Correo o contraseña inválidos');
            return;
          }
        }

        setMensaje('Error del servidor. Intente más tarde.');
      } else {
        setMensaje('Error de red. Verifica tu conexión e inténtalo nuevamente.');
      }
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
        <div className="logoBN" style={{ textAlign: 'center' }}>
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