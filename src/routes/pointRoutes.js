import express from "express";
import { getPoints, createPoint } from "../controllers/pointController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🌍 Obtener todos los puntos (público, visible en el mapa)
router.get("/", getPoints);

// 🏢 Crear un punto nuevo (solo usuarios autenticados — empresa o admin)
router.post("/", protect, createPoint);

export default router;
