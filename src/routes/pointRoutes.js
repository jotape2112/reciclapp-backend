import express from "express";
import { getPoints, createPoint } from "../controllers/pointController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔹 Público: ver puntos de reciclaje
router.get("/", getPoints);

// 🔹 Solo empresas: crear nuevos puntos
router.post("/", protect, createPoint);

export default router;
