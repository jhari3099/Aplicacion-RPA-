import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../api'; // <--- Importa la URL base

function Historial() {
  const [reclamos, setReclamos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Estados para confirmación por fila
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [resolviendo, setResolviendo] = useState(false);

  const cargarReclamos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reclamos`);
      setReclamos(res.data);
    } catch (error) {
      console.error('❌ Error al obtener reclamos:', error);
    }
  };

  useEffect(() => {
    cargarReclamos();
  }, []);

  // Abre modal de confirmación para un reclamo
  const openConfirmFor = (reclamo, e) => {
    if (e) e.stopPropagation();
    console.log('openConfirmFor ->', reclamo?.id);
    setConfirmTarget(reclamo);
  };

  const closeConfirm = (e) => {
    if (e) e.stopPropagation();
    setConfirmTarget(null);
  };

  // Llama a la API para marcar como resuelto (single)
  const confirmResolveSingle = async (e) => {
    if (e) e.stopPropagation();
    if (!confirmTarget) return;
    console.log('confirmResolveSingle ->', confirmTarget.id);
    setResolviendo(true);
    try {
      await axios.patch(`${API_URL}/api/reclamos/${confirmTarget.id}`, { estado: 'Resuelto' });
      // Actualiza estado local sin recargar todo
      setReclamos(prev => prev.map(r => r.id === confirmTarget.id ? { ...r, estado: 'Resuelto' } : r));
    } catch (error) {
      console.error('❌ Error al actualizar el estado:', error);
    } finally {
      setResolviendo(false);
      setConfirmTarget(null);
    }
  };

  const reclamosFiltrados = reclamos.filter(r => {
    const coincideEstado =
      filtroEstado === 'todos' ||
      r.estado?.trim().toLowerCase() === filtroEstado;

    const coincideBusqueda =
      r.id?.toString().includes(busqueda) ||
      r.categoria?.toLowerCase().includes(busqueda.toLowerCase() || '');

    return coincideEstado && (busqueda === '' ? true : coincideBusqueda);
  });

  return (
    <div style={{
      backgroundColor: '#D22630',
      minHeight: '100vh',
      padding: '2rem',
      overflowY: 'auto',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '2rem',
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        color: '#000'
      }}>
        <h2 style={{ textAlign: 'center', color: '#D22630' }}>Historial de Reclamos</h2>

        {/* Filtro y búsqueda */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
            style={{ padding: '0.5rem' }}
          >
            <option value="todos">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="resuelto">Resueltos</option>
          </select>

          <input
            type="text"
            placeholder="Buscar por ID o Categoría"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={{ padding: '0.5rem', flex: '1' }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f8f8' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Fecha</th>
                <th style={thStyle}>Categoría</th>
                <th style={thStyle}>Descripción</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {reclamosFiltrados.length > 0 ? (
                reclamosFiltrados.map((r) => (
                  <tr key={r.id}>
                    <td style={tdStyle}>{r.id}</td>
                    <td style={tdStyle}>{r.fecha ? new Date(r.fecha).toLocaleDateString('es-PE') : '-'}</td>
                    <td style={tdStyle}>{r.categoria}</td>
                    <td style={tdStyle}>{r.descripcion}</td>
                    <td style={{
                      ...tdStyle,
                      fontWeight: 'bold',
                      color: r.estado?.trim().toLowerCase() === 'resuelto' ? '#27ae60' : '#e67e22'
                    }}>
                      {r.estado}
                    </td>
                    <td style={tdStyle}>
                      {r.estado?.trim().toLowerCase() === 'pendiente' && (
                        <button
                          type="button"
                          onClick={(e) => openConfirmFor(r, e)}
                          style={{
                            backgroundColor: '#2ecc71',
                            color: '#fff',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          Resolver
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>
                    No se encontraron reclamos con esos criterios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación por fila */}
      {confirmTarget && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{ background: '#fff', padding: '1.2rem', borderRadius: 8, width: '90%', maxWidth: 420 }}>
            <h3>Confirmar</h3>
            <p>¿Desea marcar como resuelto el reclamo #{confirmTarget.id} - "{confirmTarget.categoria}"?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
              <button type="button" onClick={closeConfirm} style={{ padding: '0.5rem 1rem', borderRadius: 6 }}>Cancelar</button>
              <button
                type="button"
                onClick={confirmResolveSingle}
                disabled={resolviendo}
                style={{ padding: '0.5rem 1rem', borderRadius: 6, background: '#2ecc71', color: '#fff', border: 'none' }}
              >
                {resolviendo ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const thStyle = {
  padding: '0.75rem',
  textAlign: 'left',
  borderBottom: '2px solid #ddd',
  color: '#000'
};

const tdStyle = {
  padding: '0.6rem',
  borderBottom: '1px solid #eee',
  color: '#000'
};

export default Historial;