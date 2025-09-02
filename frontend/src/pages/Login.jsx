import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setUsuario }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/usuarios/login', {
        correo,
        password
      });

      const usuario = res.data;
      localStorage.setItem('usuario', JSON.stringify(usuario));
      setUsuario(usuario);
      // No haces navigate aquí, el App decide la ruta correcta

    } catch (error) {
      console.error('❌ Error al iniciar sesión:', error);
      setMensaje('❌ Correo o contraseña inválidos');
    }
  };

  return (
    <div style={{
      backgroundColor: '#D22630',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ color: '#D22630', textAlign: 'center' }}>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo"
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
          {mensaje && <p style={{ color: 'red', marginTop: '1rem' }}>{mensaje}</p>}
        </form>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            type="button"
            style={linkButtonStyle}
            onClick={() => navigate('/registro')}
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  marginBottom: '1rem',
  padding: '0.5rem',
  fontSize: '1rem',
  borderRadius: '5px',
  border: '1px solid #ccc'
};

const buttonStyle = {
  width: '100%',
  padding: '0.7rem',
  backgroundColor: '#D22630',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const linkButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#D22630',
  fontWeight: 'bold',
  cursor: 'pointer',
  textDecoration: 'underline',
  fontSize: '0.95rem'
};

export default Login;