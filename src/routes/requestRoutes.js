import express from "express";
import { createRequest, getUserRequests, updateStatus, getAllRequests } from "../controllers/requestController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Usuario crea solicitud
//router.post('/', auth, createRequest);

// Usuario ve su historial
router.get('/my', auth, getUserRequests);

// Empresa/admin ve todas las solicitudes
router.get('/', auth, getAllRequests);

// Empresa actualiza estado (aceptar/rechazar/completar)
router.put('/:id', auth, updateStatus);

export default router;
