import express from "express";
import {
  createRequest,
  getUserRequests,
  getAllRequests,
  updateStatus,
  getCompletedRequests,
  getStats,
  rateRequest,              // 👈 NUEVO
} from "../controllers/requestController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", protect, createRequest);

// Historial del usuario
router.get("/user", protect, getUserRequests);
router.get("/my", protect, getUserRequests);

// Todas las solicitudes (empresa/admin)
router.get("/", protect, getAllRequests);

// Actualizar estado
router.put("/:id", protect, updateStatus);

// ⭐ Calificar solicitud
router.put("/:id/rating", protect, rateRequest);

router.get("/completed", protect, getCompletedRequests);
router.get("/stats", protect, getStats);

export default router;
