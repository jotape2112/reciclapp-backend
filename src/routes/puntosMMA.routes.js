// src/routes/puntosMMA.routes.js
import express from "express";
import { getPuntosMMA } from "../controllers/puntosMMAController.js";

const router = express.Router();

// GET /api/puntos-mma
router.get("/", getPuntosMMA);

export default router;
