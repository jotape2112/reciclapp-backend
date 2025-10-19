const express = require('express');
const router = express.Router();
const { createPoint, getAllPoints, getPointsByMaterial, updatePoint, deletePoint } = require('../controllers/recyclingPointController');
const auth = require('../middlewares/auth');

// Crear punto de reciclaje (empresa/admin)
router.post('/', auth, createPoint);

// Obtener todos los puntos
router.get('/', getAllPoints);

// Filtrar por material
router.get('/material/:material', getPointsByMaterial);

// Actualizar punto
router.put('/:id', auth, updatePoint);

// Eliminar punto
router.delete('/:id', auth, deletePoint);

module.exports = router;
