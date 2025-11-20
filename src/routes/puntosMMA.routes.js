
const express = require("express");
const { getPuntosMMA } = require("../controllers/puntosMMA.controller.js");

const router = express.Router();

// GET /api/puntos-mma
router.get("/", getPuntosMMA);

module.exports = router;
