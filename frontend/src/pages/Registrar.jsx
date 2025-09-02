import React, { useState } from 'react';
import axios from 'axios';
import './Registrar.css';

function Registrar({ usuario }) {
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoReclamo = {
      fecha: new Date().toISOString().slice(0, 10),
      categoria: tipo,
      descripcion,
      estado: 'Pendiente',
      correo: usuario.correo, // Usa el correo del usuario autenticado
    };

    try {
      await axios.post('http://localhost:3001/api/reclamos', nuevoReclamo);
      const response = await axios.post('http://localhost:3001/api/uipath/enviar', nuevoReclamo);
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