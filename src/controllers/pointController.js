import Point from "../models/Point.js";

// ✅ Obtener todos los puntos de reciclaje
export const getPoints = async (req, res) => {
  try {
    const points = await Point.find().populate("companyId", "name email");
    res.json(points);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener los puntos de reciclaje" });
  }
};

// ✅ Crear nuevo punto (solo empresas)
export const createPoint = async (req, res) => {
  try {
    if (req.user.role !== "empresa") {
      return res.status(403).json({ message: "Solo las empresas pueden crear puntos de reciclaje" });
    }

    const nuevoPunto = await Point.create({
      ...req.body,
      companyId: req.user.id,
    });

    res.status(201).json(nuevoPunto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear el punto de reciclaje" });
  }
};
