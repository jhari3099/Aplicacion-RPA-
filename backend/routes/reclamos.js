import express from 'express';
import { db } from '../config/db.js';
import { exportarReclamos } from '../utils/exportarReclamos.js';
import axios from 'axios';

const router = express.Router();

// GET /api/reclamos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM reclamos');
    res.json(rows);
  } catch (error) {
    console.error('ERROR SQL:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// GET /api/reclamos/por-vencer
router.get('/por-vencer', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM reclamos WHERE estado = "Pendiente" AND fecha <= DATE_SUB(CURDATE(), INTERVAL 10 DAY)`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al consultar reclamos por vencer:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// POST /api/reclamos
router.post('/', async (req, res) => {
  const { fecha, categoria, descripcion, estado, correo } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO reclamos (fecha, categoria, descripcion, estado) VALUES (?, ?, ?, ?)',
      [fecha, categoria, descripcion, estado]
    );

    await exportarReclamos();

    // Intenta enviar a UiPath, pero no detengas el registro si falla
    try {
      await axios.post('http://localhost:3001/api/uipath/enviar', {
        fecha, categoria, descripcion, estado, correo
      });
    } catch (uipathError) {
      console.error('Error enviando a UiPath:', uipathError.message);
      // Opcional: puedes guardar el error en logs, pero no respondas 500
    }

    res.status(201).json({ message: 'Reclamo registrado correctamente', id: result.insertId });
  } catch (error) {
    console.error('ERROR SQL:', error.message);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
});

// PUT /api/reclamos/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('UPDATE reclamos SET estado = "Resuelto" WHERE id = ?', [id]);
    await exportarReclamos();
    res.json({ message: 'Estado actualizado a Resuelto' });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ✅ GET /api/reclamos/:id → ¡Esta ruta DEBE ir al final!
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM reclamos WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Reclamo no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener reclamo por ID:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;