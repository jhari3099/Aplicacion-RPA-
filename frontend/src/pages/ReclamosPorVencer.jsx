
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { API_URL } from '../api'; // <--- Importa la URL base

function ReclamosPorVencer({ usuario, setUsuario }) {
  const [reclamos, setReclamos] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarReclamosPorVencer = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/reclamos/por-vencer`);
        setReclamos(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('❌ Error al cargar reclamos por vencer:', error);
        setReclamos([]);
      }
    };

    cargarReclamosPorVencer();
  }, []);

  const reclamosFiltrados = reclamos.filter((r) => {
    return (
      busqueda === '' ||
      r.id.toString().includes(busqueda) ||
      r.categoria.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff' }}>
      <Sidebar usuario={usuario} setUsuario={setUsuario} />
      <div style={{ flex: 1, padding: '2rem' }}>
        <h2 style={{ color: '#D22630' }}>Reclamos Pendientes por Vencer (10+ días)</h2>

        {/* Solo input de búsqueda */}
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Buscar por ID o Tipo"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        {reclamosFiltrados.length === 0 ? (
          <p>No hay reclamos que coincidan.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f2f2f2' }}>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Días desde registro</th>
              </tr>
            </thead>
            <tbody>
              {reclamosFiltrados.map((r) => {
                const dias = Math.floor(
                  (new Date() - new Date(r.fecha)) / (1000 * 60 * 60 * 24)
                );
                return (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{new Date(r.fecha).toLocaleDateString('es-PE')}</td>
                    <td>{r.categoria}</td>
                    <td>{r.descripcion}</td>
                    <td
                      style={{
                        fontWeight: 'bold',
                        color: r.estado === 'Resuelto' ? '#27ae60' : '#e67e22'
                      }}
                    >
                      {r.estado}
                    </td>
                    <td>{dias}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ReclamosPorVencer;