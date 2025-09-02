import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoBN from '../assets/logobn-bg-blanco.png'; // Asegúrate que la ruta sea correcta

function Navbar({ usuario, setUsuario }) {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    navigate('/login');
  };

  
}

const navbarStyle = {
  backgroundColor: '#ffffffff',
  padding: '1rem 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
};

const btnStyle = {
  background: '#fff',
  color: '#D22630',
  border: '2px solid #D22630',
  margin: '0 0.5rem',
  padding: '0.5rem 1rem',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background 0.3s, color 0.3s'
};

const btnCerrar = {
  background: '#fff',
  border: '2px solid #D22630',
  padding: '0.5rem 1rem',
  borderRadius: '5px',
  fontWeight: 'bold',
  cursor: 'pointer',
  color: '#D22630',
  transition: 'background 0.3s, color 0.3s'
};


const leftSection = { flex: '1' };
const centerSection = { flex: '2', textAlign: 'center' };
const rightSection = { flex: '1', textAlign: 'right' };

export default Navbar;
