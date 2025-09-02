import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const ORCHESTRATOR_URL = `https://cloud.uipath.com/upctfibsys/DefaultTenant/odata/Queues/UiPathODataSvc.AddQueueItem`;
const QUEUE_NAME = 'SeguimientoReclamos2';
const FOLDER_ID = 357308; // Reemplaza con tu Folder ID si es necesario

// Usa tu PAT desde el .env
const UIPATH_PAT = process.env.UIPATH_PAT;

router.post('/enviar', async (req, res) => {
  const { fecha, categoria, descripcion, estado, correo } = req.body;

  try {
    const respuesta = await axios.post(
      ORCHESTRATOR_URL,
      {
        itemData: {
          Name: QUEUE_NAME,
          Priority: 'Normal',
          SpecificContent: { fecha, categoria, descripcion, estado, correo }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${UIPATH_PAT}`,
          'Content-Type': 'application/json',
          'X-UIPATH-TenantName': 'DefaultTenant',
          'X-UIPATH-OrganizationUnitId': FOLDER_ID.toString()
        }
      }
    );

    console.log('Respuesta UiPath:', respuesta.data);
    res.status(200).json({ success: true, message: '✅ Reclamo enviado a UiPath Orchestrator' });
  } catch (error) {
    console.error('❌ Error al enviar a UiPath:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Error al enviar a UiPath' });
  }
});

export default router;