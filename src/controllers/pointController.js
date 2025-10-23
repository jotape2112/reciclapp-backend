import Point from "../models/Point.js";

export const getPoints = async (req, res) => {
  try {
    const points = await Point.find().populate("companyId", "name email");
    res.json(points);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener los puntos de reciclaje" });
  }
};

export const createPoint = async (req, res) => {
  try {
    if (req.user.role !== "empresa") {
      return res.status(403).json({ message: "Solo las empresas pueden registrar puntos." });
    }

    const newPoint = await Point.create({
      name: req.body.name,
      address: req.body.address,
      materials: req.body.materials,
      companyId: req.user._id,
    });

    res.status(201).json(newPoint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear el punto de reciclaje" });
  }
};

