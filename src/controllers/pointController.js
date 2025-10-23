import Point from "../models/Point.js";

export const getPoints = async (req, res) => {
  try {
    const points = await Point.find();
    res.json(points);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener los puntos de reciclaje" });
  }
};
