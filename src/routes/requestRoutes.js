import express from "express";
import {
  createRequest,
  getUserRequests,
  getAllRequests,
  updateStatus,
} from "../controllers/requestController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/", auth, createRequest);
router.get("/my", auth, getUserRequests);
router.get("/", auth, getAllRequests);
router.put("/:id", auth, updateStatus);

export default router;
