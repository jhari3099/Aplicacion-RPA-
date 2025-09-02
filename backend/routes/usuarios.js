import express from 'express';
import { db } from '../config/db.js';

const router = express.Router();

router.post('/registrar', async (req, res) => {
  const { nombre, correo, password, rol } = req.body;

  try {
    // Verificar si ya existe un usuario con ese correo
    const [existe] = await db.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (existe.length > 0) {
      return res.status(409).json({ message: 'Correo ya registrado' });
    }

    // Insertar nuevo usuario
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


router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  try {
    const [usuarios] = await db.execute(
      'SELECT id, nombre, correo, rol FROM usuarios WHERE correo = ? AND password = ?',
      [correo, password]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const usuario = usuarios[0];
    res.json(usuario); // devolvemos el usuario sin la contraseña
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});



export default router;
