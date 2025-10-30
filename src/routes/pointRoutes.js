import express from "express";
import { getPoints, createPoint } from "../controllers/pointController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🌍 Obtener todos los puntos (público, visible en el mapa)
router.get("/", getPoints);

// 🏢 Crear un punto nuevo (solo usuarios autenticados — empresa o admin)
router.post("/", protect, createPoint);

import express from "express";
import { getPoints } from "../controllers/pointController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Ruta temporal para depuración
router.post("/debug", (req, res) => {
  console.log("🧠 Datos recibidos en /debug:", req.body);
  res.json({ recibido: req.body });
});

router.get("/", getPoints);

export default router;


export default router;
