import React from 'react';
import { FaTachometerAlt, FaClock, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logoBNb from '../assets/logobn-bg-blanco.png'; // Asegúrate que la ruta sea correcta

const sidebarStyle = {
  width: '230px',
  background: '#fff',
  color: '#000',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  padding: '2rem 1rem 1rem 1rem',
  boxShadow: '2px 0 8px rgba(0,0,0,0.07)',
  position: 'sticky',
  top: 0,
  left: 0,
  zIndex: 10
};

const sidebarButton = {
  background: 'none',
  border: 'none',
  color: '#000',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  padding: '0.8rem 1rem',
  margin: '0.2rem 0',
  borderRadius: '8px',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background 0.2s',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '0.7rem'
};




function Sidebar({ usuario, setUsuario }) {
  const navigate = useNavigate();
  
 const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    navigate('/login');
  };


  return (




    <div style={sidebarStyle}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
       <img src={logoBNb} alt="Banco de la Nación" style={{ width: '200px', height: '120px', marginBottom: '2rem' }} />
      </div>
      <button style={sidebarButton} onClick={() => navigate('/')}>
        <FaTachometerAlt /> Dashboard
      </button>
      <button style={sidebarButton} onClick={() => navigate('/reclamos-por-vencer')}>
        <FaClock /> Por Vencer
      </button>
      <button style={sidebarButton} onClick={() => navigate('/estadisticas')}>
        <FaChartBar /> Estadísticas
      </button>
      <div style={{ flex: 0.01 }} />
      👤 {usuario?.nombre} ({usuario?.rol})
      <button style={sidebarButton} onClick={cerrarSesion}>
        <FaSignOutAlt /> Cerrar sesión
      </button>
    </div>
  );
}

export default Sidebar;

