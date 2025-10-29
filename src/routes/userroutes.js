import express from "express";
import { register, login, getProfile } from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js"; // ✅ Importa correctamente la función protect

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile); // ✅ Usa protect en vez de auth

export default router;
