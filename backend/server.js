import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reclamosRoutes from './routes/reclamos.js';
import usuariosRoutes from './routes/usuarios.js';
import uipathRoutes from './routes/uipath.js';

dotenv.config();

const app = express();

// CORS para todas las rutas y métodos
app.use(cors());
app.options('*', cors());

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