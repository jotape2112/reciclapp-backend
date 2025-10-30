import { protect } from "../middlewares/authMiddleware.js";
import express from "express";
import { getPoints } from "../controllers/pointController.js";
const router = express.Router();

router.get("/", getPoints);

export default router;
