import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Registro.css';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('cliente');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/usuarios/registrar', {
        nombre,
        correo,
        password,
        rol
      });

      setMensaje('✅ Registro exitoso. Ahora puedes iniciar sesión.');
      setNombre('');
      setCorreo('');
      setPassword('');
      setRol('cliente');

      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      console.error('❌ Error al registrar:', error);
      setMensaje('❌ Ya existe un usuario con ese correo.');
    }
  };

  return (
    <div className="registro-wrapper">
      <div className="registro-card">
        <h2 style={{ color: '#D22630', textAlign: 'center' }}>Crear cuenta</h2>
        <form onSubmit={handleRegistro}>
          <input type="text" placeholder="Nombre completo" value={nombre}
            onChange={(e) => setNombre(e.target.value)} required className="registro-input" />
          <input type="email" placeholder="Correo" value={correo}
            onChange={(e) => setCorreo(e.target.value)} required className="registro-input" />
          <input type="password" placeholder="Contraseña" value={password}
            onChange={(e) => setPassword(e.target.value)} required className="registro-input" />
          <select value={rol} onChange={(e) => setRol(e.target.value)} className="registro-input">
            <option value="cliente">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
          <button type="submit" className="registro-btn">Registrarse</button>

          {mensaje && (
            <p style={{ marginTop: '1rem', color: mensaje.startsWith('✅') ? 'green' : 'red' }}>
              {mensaje}
            </p>
          )}
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            className="registro-link-btn"
          >
            ¿Ya tienes una cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Registro;
