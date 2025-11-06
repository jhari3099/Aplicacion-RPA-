import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { API_URL } from '../api'; // <--- Importa la URL base

const COLORS = ['#f39c12', '#2ecc71'];

function Dashboard({ usuario, setUsuario }) {
  const [reclamos, setReclamos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingResolve, setLoadingResolve] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/reclamos`);
        setReclamos(res.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    cargarDatos();
  }, []);

  const reclamosFiltrados = reclamos.filter(r => {
    const coincideEstado =
      filtroEstado === 'todos' || r.estado?.trim().toLowerCase() === filtroEstado;
    const coincideBusqueda =
      r.id?.toString().includes(busqueda) ||
      r.categoria?.toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && (busqueda === '' ? true : coincideBusqueda);
  });

  const pendientes = reclamosFiltrados.filter(r => r.estado?.trim().toLowerCase() === 'pendiente').length;
  const resueltos = reclamosFiltrados.filter(r => r.estado?.trim().toLowerCase() === 'resuelto').length;
  const total = reclamosFiltrados.length;

  const data = [
    { name: 'Pendientes', value: pendientes },
    { name: 'Resueltos', value: resueltos }
  ];

  const openConfirm = () => setShowConfirm(true);
  const closeConfirm = () => setShowConfirm(false);

  const confirmMarkResolved = async () => {
    if (reclamosFiltrados.length === 0) {
      setShowConfirm(false);
      return;
    }
    setLoadingResolve(true);
    try {
      // Si tu API soporta bulk update, úsalo. Aquí se actualiza uno por uno.
      await Promise.all(
        reclamosFiltrados.map(r =>
          axios.patch(`${API_URL}/api/reclamos/${r.id}`, { estado: 'Resuelto' })
        )
      );
      // Recargar lista
      const res = await axios.get(`${API_URL}/api/reclamos`);
      setReclamos(res.data);
    } catch (error) {
      console.error('Error marcando como resuelto:', error);
    } finally {
      setLoadingResolve(false);
      setShowConfirm(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar usuario={usuario} setUsuario={setUsuario} />
      <div style={{ marginLeft: '240px', flex: 1, padding: '2rem', backgroundColor: '#f5f6fa', minHeight: '100vh' }}>
        <h2 style={{ color: '#D22630', textAlign: 'center' }}>Panel de Control</h2>

        {/* Filtros */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
            style={inputStyle}
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
            style={inputStyle}
          />
        </div>

        {/* Tarjetas */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <div style={cardStyle('#f1c40f')}><h4>Pendientes</h4><p>{pendientes}</p></div>

          <div
            style={{ ...cardStyle('#2ecc71'), cursor: 'pointer' }}
            onClick={openConfirm}
            title="Marcar los reclamos filtrados como resueltos"
          >
            <h4>Resueltos</h4>
            <p>{resueltos}</p>
            <small>Presiona para confirmar</small>
          </div>

          <div style={cardStyle('#3498db')}><h4>Total</h4><p>{total}</p></div>
        </div>

        {/* Gráfico */}
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '1rem', borderRadius: '10px' }}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
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

        {/* Botones */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={() => navigate('/registrar')} style={btnStyle}>Registrar Reclamo</button>
          <button onClick={() => navigate('/historial')} style={btnStyle}>Ver Historial</button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', width: '90%', maxWidth: '420px' }}>
            <h3>Confirmar</h3>
            <p>¿Desea marcar los {reclamosFiltrados.length} reclamos filtrados como resueltos?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
              <button onClick={closeConfirm} style={{ padding: '0.5rem 1rem', borderRadius: 6 }}>No</button>
              <button
                onClick={confirmMarkResolved}
                style={{ padding: '0.5rem 1rem', borderRadius: 6, background: '#2ecc71', color: '#fff', border: 'none' }}
                disabled={loadingResolve}
              >
                {loadingResolve ? 'Procesando...' : 'Sí, marcar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: '0.5rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  minWidth: '150px'
};

const cardStyle = (color) => ({
  backgroundColor: color,
  padding: '1.2rem',
  borderRadius: '10px',
  color: '#fff',
  flex: '1',
  minWidth: '200px',
  textAlign: 'center',
  fontSize: '1.2rem'
});

const btnStyle = {
  margin: '0 1rem',
  padding: '0.8rem 1.5rem',
  backgroundColor: '#34495e',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default Dashboard;