import Request from "../models/Request.js";

// ✅ Crear solicitud
export const createRequest = async (req, res) => {
  try {
    const { items, address, schedule } = req.body;

    const newRequest = new Request({
      userId: req.user.id,
      items,
      address,
      schedule,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear la solicitud" });
  }
};

// ✅ Ver solicitudes del usuario autenticado
export const getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener las solicitudes" });
  }
};

// ✅ Ver todas las solicitudes (solo empresa/admin)
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate("userId", "name email").sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener las solicitudes" });
  }
};

// ✅ Actualizar estado (aceptar, rechazar, completar)
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pendiente", "aceptada", "rechazada", "completada"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado no válido" });
    }

    const updated = await Request.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: "Solicitud no encontrada" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar el estado" });
  }
};
