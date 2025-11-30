import express from "express";
import {
  createRequest,
  getUserRequests,
  getAllRequests,
  updateStatus,
  getCompletedRequests,
  getStats,
} from "../controllers/requestController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", protect, createRequest);

// 👇 Rutas para historial del usuario
router.get("/user", protect, getUserRequests);  // la que ya tenías
router.get("/my", protect, getUserRequests);    // NUEVA, usada por el frontend

router.get("/", protect, getAllRequests);
router.put("/:id", protect, updateStatus);
router.get("/completed", protect, getCompletedRequests);
router.get("/stats", protect, getStats);

export default router;
