import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reclamosRoutes from './routes/reclamos.js';
import usuariosRoutes from './routes/usuarios.js';
import uipathRoutes from './routes/uipath.js';

dotenv.config();

const app = express();

// Permite CORS desde cualquier origen (puedes restringirlo si quieres)
app.use(cors({
  origin: '*', // O pon aquí la URL de tu frontend, ej: 'http://localhost:5173'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/reclamos', reclamosRoutes);
console.log('Rutas de reclamos montadas');

app.use('/api/usuarios', usuariosRoutes);

app.use('/api/uipath', uipathRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});