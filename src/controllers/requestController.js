const Request = require('../models/Request');

// Crear una nueva solicitud
const createRequest = async (req, res) => {
  try {
    const { items, address, schedule } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Debes incluir al menos un material." });
    }

    const newRequest = new Request({
      userId: req.user.id, // lo trae del middleware `auth`
      items,
      address,
      schedule,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la solicitud" });
  }
};

// Obtener solicitudes de un usuario
const getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener historial" });
  }
};

// Obtener todas las solicitudes (para empresa/admin)
const getAllRequests = async (req, res) => {
  try {
    if (req.user.role === "company") {
      // Empresa: ver solicitudes pendientes o asignadas
      const requests = await Request.find({
        $or: [
          { status: "pendiente" },
          { companyId: req.user._id }
        ]
      }).populate("userId", "name email");
      return res.json(requests);
    }

    if (req.user.role === "admin") {
      // Admin: ver todas
      const requests = await Request.find()
        .populate("userId", "name email")
        .populate("companyId", "name email");
      return res.json(requests);
    }

    return res.status(403).json({ message: "Acceso denegado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar estado de una solicitud
// Empresa actualiza estado de una solicitud
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['aceptada', 'rechazada', 'completada'].includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    // Guardamos la empresa que acepta/rechaza
    request.status = status;
    request.companyId = req.user.id; // la empresa logueada
    await request.save();

    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar estado" });
  }
};


module.exports = { createRequest, getUserRequests, getAllRequests, updateStatus };
