import Point from "../models/Point.js";

// Obtener puntos
export const getPoints = async (req, res) => {
  try {
    const points = await Point.find();
    res.json(points);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los puntos" });
  }
};

// Crear un nuevo punto (empresa)
export const createPoint = async (req, res) => {
  try {
    const { name, address, latitude, longitude, materials } = req.body;

    if (!name || !address || !latitude || !longitude || !materials) {
      return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    const point = new Point({
      name,
      address,
      latitude,
      longitude,
      materials,
      companyId: req.user?.id || null,
    });

    await point.save();
    res.status(201).json(point);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear el punto de reciclaje." });
  }
};
us(201).json(newPoint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear el punto de reciclaje" });
  }
};

