import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import Sidebar from '../components/Sidebar';
import { API_URL } from '../api'; // <--- Importa la URL base

const COLORS = ['#D22630', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c', '#e74c3c'];

function Estadisticas({ usuario, setUsuario }) {
  const [estadoData, setEstadoData] = useState([]);
  const [categoriaEstadoData, setCategoriaEstadoData] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/reclamos`);
        const reclamos = res.data;

        // PieChart por estado
        const pendientes = reclamos.filter(r => r.estado === 'Pendiente').length;
        const resueltos = reclamos.filter(r => r.estado === 'Resuelto').length;

        setEstadoData([
          { name: 'Pendientes', value: pendientes },
          { name: 'Resueltos', value: resueltos }
        ]);

        // BarChart por categoría y estado
        const catMap = {};
        reclamos.forEach(r => {
          const cat = r.categoria || 'Sin Categoría';
          if (!catMap[cat]) {
            catMap[cat] = { categoria: cat, Pendientes: 0, Resueltos: 0 };
          }
          if (r.estado === 'Pendiente') {
            catMap[cat].Pendientes += 1;
          } else if (r.estado === 'Resuelto') {
            catMap[cat].Resueltos += 1;
          }
        });

        setCategoriaEstadoData(Object.values(catMap));

      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff' }}>
      <Sidebar usuario={usuario} setUsuario={setUsuario} />
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '2rem',
        maxWidth: '1000px',
        margin: '2rem auto',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        flex: 1
      }}>
        <h2 style={{ textAlign: 'center', color: '#D22630' }}>Estadísticas de Reclamos</h2>

        {/* PieChart Estado */}
        <h3 style={{ textAlign: 'center' }}>Por Estado General</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={estadoData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              labelLine={false}
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {estadoData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        {/* BarChart por tipo y estado */}
        <h3 style={{ textAlign: 'center', marginTop: '3rem' }}>Por Tipo de Reclamo y Estado</h3>
        {categoriaEstadoData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoriaEstadoData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="categoria" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Pendientes" fill="#D22630 " />
              <Bar dataKey="Resueltos" fill="#2ecc71" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p style={{ textAlign: 'center' }}>No hay datos de categorías.</p>
        )}
      </div>
    </div>
  );
}

export default Estadisticas;