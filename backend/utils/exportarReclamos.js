import { db } from '../config/db.js';
import fs from 'fs';

export async function exportarReclamos() {
  try {
    const [rows] = await db.execute(`
      SELECT id, fecha, categoria, descripcion, estado
      FROM reclamos
      WHERE estado = 'Pendiente'
    `);

    fs.writeFileSync('./reclamos.json', JSON.stringify(rows, null, 2));
    console.log('✅ Archivo reclamos.json generado');
  } catch (error) {
    console.error('❌ Error al exportar reclamos:', error);
  }
}
