const RecyclingPoint = require('../models/RecyclingPoint');

// Crear punto de reciclaje (empresa/admin)
const createPoint = async (req, res) => {
  try {
    const { name, address, latitude, longitude, materials } = req.body;

    const newPoint = await RecyclingPoint.create({
      name,
      address,
      latitude,
      longitude,
      materials,
      companyId: req.user.id // empresa logueada
    });

    res.status(201).json(newPoint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear punto de reciclaje' });
  }
};

// Obtener todos los puntos
const getAllPoints = async (req, res) => {
  try {
    const points = await RecyclingPoint.find().populate('companyId', 'name email');
    res.json(points);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener puntos' });
  }
};

// Filtrar puntos por material
const getPointsByMaterial = async (req, res) => {
  try {
    const { material } = req.params;
    const points = await RecyclingPoint.find({ materials: material });
    res.json(points);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al filtrar puntos' });
  }
};

// Actualizar punto (empresa/admin)
const updatePoint = async (req, res) => {
  try {
    const point = await RecyclingPoint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!point) return res.status(404).json({ message: 'Punto no encontrado' });
    res.json(point);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar punto' });
  }
};

// Eliminar punto (empresa/admin)
const deletePoint = async (req, res) => {
  try {
    const point = await RecyclingPoint.findByIdAndDelete(req.params.id);
    if (!point) return res.status(404).json({ message: 'Punto no encontrado' });
    res.json({ message: 'Punto eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar punto' });
  }
};

module.exports = {
  createPoint,
  getAllPoints,
  getPointsByMaterial,
  updatePoint,
  deletePoint
};
