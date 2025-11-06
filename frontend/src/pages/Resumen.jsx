import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaClock, FaCheckCircle, FaList, FaEye } from 'react-icons/fa';
import { API_URL } from '../api'; // <--- Importa la URL base

const COLORS = ['#D22630', '#2ecc71']; // Rojo y verde

function Resumen({ usuario, setUsuario }) {
  const [reclamos, setReclamos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [ordenAscendente, setOrdenAscendente] = useState(false);

  // Estados para confirmación por fila
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [resolviendo, setResolviendo] = useState(false);

  const navigate = useNavigate();

  const cargarDatos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reclamos`);
      setReclamos(res.data);
    } catch (error) {
      console.error('Error al cargar reclamos:', error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const marcarResuelto = async (id) => {
    try {
      await axios.put(`${API_URL}/api/reclamos/${id}`);
      await cargarDatos();
    } catch (error) {
      console.error('❌ Error al actualizar el estado:', error);
    }
  };

  // Abrir / cerrar modal
  const openConfirmFor = (reclamo, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setConfirmTarget(reclamo);
  };

  const closeConfirmFor = (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setConfirmTarget(null);
  };

  const confirmResolveSingle = async (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!confirmTarget) return;
    setResolviendo(true);
    try {
      await marcarResuelto(confirmTarget.id);
    } finally {
      setResolviendo(false);
      setConfirmTarget(null);
    }
  };

  const reclamosFiltrados = reclamos
    .filter(r => {
      const coincideEstado = filtroEstado === 'todos' || r.estado?.trim().toLowerCase() === filtroEstado;
      const coincideBusqueda =
        r.id.toString().includes(busqueda) ||
        r.categoria?.toLowerCase().includes(busqueda.toLowerCase());
      return coincideEstado && coincideBusqueda;
    })
    .sort((a, b) => (ordenAscendente ? a.id - b.id : b.id - a.id));

  const pendientes = reclamosFiltrados.filter(r => r.estado?.trim().toLowerCase() === 'pendiente').length;
  const resueltos = reclamosFiltrados.filter(r => r.estado?.trim().toLowerCase() === 'resuelto').length;
  const total = reclamosFiltrados.length;

  const data = [
    { name: 'Pendientes', value: pendientes },
    { name: 'Resueltos', value: resueltos }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff' }}>
      <Sidebar usuario={usuario} setUsuario={setUsuario} />

      <div style={{ flex: 1, padding: '2rem', background: '#fff' }}>
        <h2 style={{ color: '#D22630', textAlign: 'center', marginBottom: '2rem' }}>Resumen General</h2>

        {/* FILTROS */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          justifyContent: 'flex-start'
        }}>
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
            style={{padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', minWidth: '200px' }}
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
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', minWidth: '80%' }}
          />
        </div>

        {/* TARJETAS + GRAFICO */}
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            justifyContent: 'center',
            alignItems: 'flex-start',
            marginBottom: '2rem'
          }}
        >
          {/* Tarjetas apiladas verticalmente */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '220px' }}>
            {miniCard(
              '#fff',
              '#D22630',
              <FaClock />,
              'Pendientes',
              pendientes,
              () => setFiltroEstado('pendiente'),
              filtroEstado === 'pendiente'
            )}
            {miniCard(
              '#fff',
              '#2ecc71',
              <FaCheckCircle />,
              'Resueltos',
              resueltos,
              () => setFiltroEstado('resuelto'),
              filtroEstado === 'resuelto'
            )}
            {miniCard(
              '#fff',
              '#3498db',
              <FaList />,
              'Total',
              total,
              () => setFiltroEstado('todos'),
              filtroEstado === 'todos'
            )}
          </div>

          {/* Gráfico a la derecha */}
          <div
            style={{
              maxWidth: '800px',
              minWidth: '320px',
              backgroundColor: '#fff',
              padding: '1rem',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #eee',
              flex: 1
            }}
          >
            <ResponsiveContainer width="100%" height={430}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABLA */}
        <h3 style={{ marginTop: '2rem', color: '#D22630' }}>Historial de Reclamos</h3>
        <div style={{
          overflowX: 'auto',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '1px solid #eee'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f8f8f8' }}>
              <tr>
                <th style={th} onClick={() => setOrdenAscendente(!ordenAscendente)}>ID {ordenAscendente ? '↑' : '↓'}</th>
                <th style={th}>Fecha</th>
                <th style={th}>Categoría</th>
                <th style={th}>Descripción</th>
                <th style={th}>Estado</th>
                <th style={th}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {reclamosFiltrados.length > 0 ? (
                reclamosFiltrados.map(r => (
                  <tr key={r.id}>
                    <td style={td}>{r.id}</td>
                    <td style={td}>{new Date(r.fecha).toLocaleDateString('es-PE')}</td>
                    <td style={td}>{r.categoria}</td>
                    <td style={td}>{r.descripcion}</td>
                    <td style={{
                      ...td,
                      fontWeight: 'bold',
                      color: r.estado?.trim().toLowerCase() === 'resuelto' ? '#2ecc71' : '#D22630'
                    }}>
                      {r.estado}
                    </td>
                    <td style={td}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {r.estado?.trim().toLowerCase() === 'pendiente' && (
                          <button
                            type="button"
                            onClick={(e) => openConfirmFor(r, e)}
                            style={btnAction('#2ecc71')}
                          >
                            Resuelto
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => navigate(`/reclamo/${r.id}`)}
                          style={{
                            ...btnAction('#3498db'),
                            padding: '0.4rem 0.6rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Ver Detalle"
                        >
                          <FaEye size={18} />
                        </button>
                      </div>
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
              <button type="button" onClick={closeConfirmFor} style={{ padding: '0.5rem 1rem', borderRadius: 6 }}>Cancelar</button>
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

// Tarjeta blanca con borde y acento de color
const miniCard = (bgColor, borderColor, icon, label, value, onClick, selected) => (
  <div
    onClick={onClick}
    style={{
      backgroundColor: bgColor,
      border: `2px solid ${borderColor}`,
      padding: '1rem',
      borderRadius: '10px',
      color: borderColor,
      flex: '1',
      minWidth: '200px',
      textAlign: 'center',
      fontWeight: 'bold',
      boxShadow: selected ? '0 4px 16px rgba(210,38,48,0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
      cursor: 'pointer',
      opacity: selected ? 1 : 0.92,
      transition: 'box-shadow 0.2s, transform 0.2s, opacity 0.2s',
      transform: selected ? 'scale(1.04)' : 'scale(1)',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(210,38,48,0.18)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = selected ? '0 4px 16px rgba(210,38,48,0.15)' : '0 2px 8px rgba(0,0,0,0.08)'}
  >
    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
    <div>{label}</div>
    <div style={{ fontSize: '1.4rem' }}>{value}</div>
  </div>
);

const th = {
  padding: '0.75rem',
  textAlign: 'left',
  borderBottom: '1px solid #eee',
  background: '#f8f8f8',
  color: '#333',
  cursor: 'pointer'
};

const td = {
  padding: '0.6rem',
  borderBottom: '1px solid #f4f4f4',
  color: '#222'
};

const btnAction = (color) => ({
  backgroundColor: color,
  color: '#fff',
  border: 'none',
  padding: '0.4rem 0.8rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginRight: '0.5rem'
});

export default Resumen;