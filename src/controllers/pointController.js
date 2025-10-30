// src/controllers/pointController.js
import Point from "../models/Point.js";

// Obtener todos los puntos (visible en el mapa)
export const getPoints = async (req, res) => {
  try {
    const points = await Point.find();
    res.json(points);
  } catch (err) {
    console.error("❌ Error al obtener puntos:", err);
    res.status(500).json({ message: "Error al obtener los puntos de reciclaje" });
  }
};

// Crear un nuevo punto (para empresa/admin)
export const createPoint = async (req, res) => {
  try {
    // Validar rol si es necesario
    if (req.user.role !== "empresa" && req.user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado para crear puntos." });
    }

    const { name, address, lat, lng, materials } = req.body;

    if (!name || !address || lat === undefined || lng === undefined) {
      return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    const newPoint = await Point.create({ name, address, lat, lng, materials });
    res.status(201).json(newPoint);
  } catch (err) {
    console.error("❌ Error al crear punto:", err);
    res.status(500).json({ message: "Error al crear el punto." });
  }
};
