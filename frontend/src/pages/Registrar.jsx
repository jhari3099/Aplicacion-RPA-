import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../api';
import { useNavigate } from 'react-router-dom';
import './Registrar.css';

function Registrar({ usuario, setUsuario }) {
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null); // Actualiza el estado global
    navigate('/login', { replace: true }); // Redirige al login
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoReclamo = {
      fecha: new Date().toISOString().slice(0, 10),
      categoria: tipo,
      descripcion,
      estado: 'Pendiente',
      correo: usuario.correo,
    };

    try {
      await axios.post(`${API_URL}/api/reclamos`, nuevoReclamo);
      const response = await axios.post(`${API_URL}/api/uipath/enviar`, nuevoReclamo);
      console.log('Respuesta de UiPath:', response.data);
      setMensaje('✅ Reclamo guardado exitosamente');
      setTipo('');
      setDescripcion('');
    } catch (error) { 
      console.error('Error al registrar reclamo o enviar a UiPath:', error);
      setMensaje('❌ Error al guardar reclamo');
    }
  };

  return (
    <div className="registro-wrapper">
      {/* Botón cerrar sesión */}
      <button
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          background: '#D22630',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          fontWeight: 'bold',
          zIndex: 10
        }}
        onClick={handleLogout}
      >
        Cerrar sesión
      </button>
      <div className="registro-container">
        <h2>Registrar Reclamo</h2>
        <form onSubmit={handleSubmit} className="formulario">
          <label>Tipo de reclamo:</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
            <option value="">Seleccione una opción</option>
            <option value="Cajero automático">Cajero automático</option>
            <option value="Transferencia fallida">Transferencia fallida</option>
            <option value="Préstamos">Préstamos</option>
            <option value="Tarjeta bloqueada">Tarjeta bloqueada</option>
          </select>

          <label>Descripción del reclamo:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={4}
            placeholder="Escriba los detalles del problema..."
          ></textarea>

          <label>Correo electrónico:</label>
          <input
            type="email"
            value={usuario.correo}
            disabled
            readOnly
            style={{ background: '#eee' }}
          />

          <button type="submit">Enviar</button>
          {mensaje && <p className="mensaje">{mensaje}</p>}
        </form>
      </div>
    </div>
  );
}

export default Registrar;