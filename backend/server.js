import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reclamosRoutes from './routes/reclamos.js';
import usuariosRoutes from './routes/usuarios.js';
import uipathRoutes from './routes/uipath.js';

dotenv.config();

const app = express(); // <-- Mueve esto arriba

app.use(cors());
app.use(express.json());

app.use('/api/reclamos', reclamosRoutes);
console.log('Rutas de reclamos montadas');

app.use('/api/usuarios', usuariosRoutes); // <-- Ahora sí, después de declarar app

app.use('/api/uipath', uipathRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});