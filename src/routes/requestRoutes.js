import express from "express";
import {
  createRequest,
  getUserRequests,
  getAllRequests,
  updateStatus,
  getCompletedRequests,
} from "../controllers/requestController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔐 Solo usuarios autenticados pueden acceder a estas rutas
router.post("/", protect, createRequest);
router.get("/user", protect, getUserRequests);
router.get("/", protect, getAllRequests);
router.put("/:id/status", protect, updateStatus);
router.get("/completed", protect, getCompletedRequests); // ✅ nueva ruta

export default router;
