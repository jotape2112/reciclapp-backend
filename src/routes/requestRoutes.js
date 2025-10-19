const express = require('express');
const router = express.Router();
const { createRequest, getUserRequests, updateStatus, getAllRequests } = require('../controllers/requestController');
const auth = require('../middlewares/auth');

// Usuario crea solicitud
router.post('/', auth, createRequest);

// Usuario ve su historial
router.get('/my', auth, getUserRequests);

// Empresa/admin ve todas las solicitudes
router.get('/', auth, getAllRequests);

// Empresa actualiza estado (aceptar/rechazar/completar)
router.put('/:id', auth, updateStatus);

export default router;
