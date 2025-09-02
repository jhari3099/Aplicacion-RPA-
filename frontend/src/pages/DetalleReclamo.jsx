import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api'; // <--- Importa la URL base

function DetalleReclamo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reclamo, setReclamo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerReclamo = async () => {
      try {
        console.log('Buscando reclamo con ID:', id);
        const res = await axios.get(`${API_URL}/api/reclamos/${id}`);
        console.log('Reclamo obtenido:', res.data);
        setReclamo(res.data);
      } catch (err) {
        console.error('Error al obtener el reclamo:', err);
        setError('No se pudo cargar el reclamo.');
      }
    };
    obtenerReclamo();
  }, [id]);

  if (error) {
    return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
  }

  if (!reclamo) {
    return <div style={{ padding: '2rem' }}>Cargando reclamo...</div>;
  }

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#D22630',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        color: '#000'
      }}>
        <h2 style={{ color: '#D22630', textAlign: 'center' }}>Detalle del Reclamo</h2>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.1rem' }}>
          <li><strong>ID:</strong> {reclamo.id}</li>
          <li><strong>Fecha:</strong> {new Date(reclamo.fecha).toLocaleDateString('es-PE')}</li>
          <li><strong>Categoría:</strong> {reclamo.categoria}</li>
          <li><strong>Descripción:</strong> {reclamo.descripcion}</li>
          <li><strong>Estado:</strong> <span style={{ color: reclamo.estado === 'Resuelto' ? '#27ae60' : '#e67e22' }}>{reclamo.estado}</span></li>
          <li><strong>Correo:</strong> {reclamo.correo || 'No registrado'}</li>
        </ul>
        <button
          style={{
            marginTop: '2rem',
            backgroundColor: '#D22630',
            color: '#fff',
            padding: '0.6rem 1.2rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '100%'
          }}
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>
      </div>
    </div>
  );
}

export default DetalleReclamo;