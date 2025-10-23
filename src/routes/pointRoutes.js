import express from "express";
import { getPoints, createPoint } from "../src/controllers/pointController.js";
import { protect } from "../src/middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPoints); // público
router.post("/", protect, createPoint); // solo empresas

export default router;
