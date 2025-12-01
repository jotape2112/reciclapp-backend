import express from "express";
import { register, login, getProfile, getCompanies } from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import { getStats } from "../controllers/requestController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.get("/stats", protect, getStats);

// 👇 NUEVA RUTA
router.get("/companies", protect, getCompanies);

export default router;
