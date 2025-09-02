import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Historial from './pages/Historial';
import Registrar from './pages/Registrar';
import Estadisticas from './pages/Estadisticas';
import Registro from './pages/Registro';
import Resumen from './pages/Resumen';
import ReclamosPorVencer from './pages/ReclamosPorVencer';
import Navbar from './components/Navbar';
import DetalleReclamo from './pages/DetalleReclamo';

function AnimatedRouteWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes({ usuario, setUsuario }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={
          usuario === null
            ? <AnimatedRouteWrapper><Login setUsuario={setUsuario} /></AnimatedRouteWrapper>
            : <Navigate to={usuario.rol === 'admin' ? '/' : '/registrar'} />
        } />

        <Route path="/registro" element={<AnimatedRouteWrapper><Registro /></AnimatedRouteWrapper>} />

        <Route
          path="/registrar"
          element={
            usuario?.rol === 'cliente'
              ? <AnimatedRouteWrapper><Registrar usuario={usuario} setUsuario={setUsuario} /></AnimatedRouteWrapper>
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/"
          element={
            usuario
              ? usuario.rol === 'admin'
                ? <AnimatedRouteWrapper><Resumen usuario={usuario} setUsuario={setUsuario} /></AnimatedRouteWrapper>
                : <Navigate to="/registrar" />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/dashboard"
          element={
            usuario?.rol === 'admin'
              ? <AnimatedRouteWrapper><Dashboard usuario={usuario} setUsuario={setUsuario} /></AnimatedRouteWrapper>
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/historial"
          element={
            usuario?.rol === 'admin'
              ? <AnimatedRouteWrapper><Historial usuario={usuario} setUsuario={setUsuario} /></AnimatedRouteWrapper>
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/estadisticas"
          element={
            usuario?.rol === 'admin'
              ? <AnimatedRouteWrapper><Estadisticas usuario={usuario} setUsuario={setUsuario} /></AnimatedRouteWrapper>
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/reclamos-por-vencer"
          element={
            usuario?.rol === 'admin'
              ? <AnimatedRouteWrapper><ReclamosPorVencer usuario={usuario} setUsuario={setUsuario} /></AnimatedRouteWrapper>
              : <Navigate to="/login" />
          }
        />

        <Route
          path="*"
          element={<Navigate to={usuario ? (usuario.rol === 'admin' ? '/' : '/registrar') : '/login'} />}
        />

        <Route
  path="/reclamo/:id"
  element={
    usuario
      ? <DetalleReclamo usuario={usuario} />
      : <Navigate to="/login" />
  }
/>

      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const sesion = localStorage.getItem('usuario');
    if (sesion) {
      try {
        const data = JSON.parse(sesion);
        if (data.rol === 'admin' || data.rol === 'cliente') {
          setUsuario(data);
        }
      } catch (error) {
        console.error('Error al parsear sesión:', error);
      }
    }
    setCargando(false);
  }, []);

  if (cargando) return null;

  return (
    <BrowserRouter>
      {usuario && <Navbar usuario={usuario} setUsuario={setUsuario} />}
      <AppRoutes usuario={usuario} setUsuario={setUsuario} />
    </BrowserRouter>
  );
}

export default App;
