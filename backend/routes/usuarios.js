import express from 'express';
import { db } from '../config/db.js';
// Si vas a usar hashing de contraseñas en el futuro:
// import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/registrar', async (req, res) => {
  const { nombre, correo, password, rol } = req.body;

  try {
    const [existe] = await db.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (existe.length > 0) {
      return res.status(409).json({ message: 'Correo ya registrado' });
    }

    // Si usas bcrypt:
    // const hashed = await bcrypt.hash(password, 10);
    // await db.execute('INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)', [nombre, correo, hashed, rol]);

    await db.execute(
      'INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, password, rol]
    );

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Endpoint para verificar existencia de correo
// GET /api/usuarios/email/:correo
router.get('/email/:correo', async (req, res) => {
  const { correo } = req.params;
  try {
    const [rows] = await db.execute('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (rows.length === 0) return res.status(404).json({ message: 'Correo no registrado' });
    return res.json({ exists: true, id: rows[0].id });
  } catch (error) {
    console.error('Error al verificar correo:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Login: primero verificar existencia de correo, luego contraseña
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Traer el usuario por correo (incluyendo password para validar)
    const [rows] = await db.execute(
      'SELECT id, nombre, correo, rol, password FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (rows.length === 0) {
      // Correo no existe -> 404
      return res.status(404).json({ message: 'Correo no registrado' });
    }

    const usuario = rows[0];

    // Si usas contraseñas hasheadas:
    // const match = await bcrypt.compare(password, usuario.password);
    // if (!match) return res.status(401).json({ message: 'Contraseña incorrecta' });

    // Si guardas contraseñas en texto (no recomendado), compara directamente:
    if (usuario.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // No devolver la contraseña al cliente
    delete usuario.password;
    res.json(usuario);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;