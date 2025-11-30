import Request from "../models/Request.js";

// ✅ Crear solicitud (solo usuario)
export const createRequest = async (req, res) => {
  try {
    if (req.user.role !== "usuario") {
      return res.status(403).json({ message: "Solo los usuarios pueden crear solicitudes." });
    }

    const nuevaSolicitud = await Request.create({
      userId: req.user.id,
      items: req.body.items || [],
      address: req.body.address,
      schedule: req.body.schedule,
      status: "pendiente",
    });

    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la solicitud." });
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

// ✅ Ver todas las solicitudes (para empresas/admin)
export const getAllRequests = async (req, res) => {
  try {
    if (req.user.role !== "empresa" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado." });
    }

    const requests = await Request.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

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

// ✅ Ver historial de solicitudes completadas (solo empresas)
export const getCompletedRequests = async (req, res) => {
  try {
    if (req.user.role !== "empresa" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Solo las empresas pueden ver el historial." });
    }

    const completed = await Request.find({ status: "completada" })
      .populate("userId", "name email")
      .sort({ updatedAt: -1 });

    res.json(completed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el historial de solicitudes completadas." });
  }
};

// ✅ Obtener estadísticas de solicitudes completadas (para empresas)
export const getStats = async (req, res) => {
  try {
    if (req.user.role !== "empresa" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Solo las empresas pueden ver estadísticas." });
    }

    const completedRequests = await Request.find({ status: "completada" })
      .populate("userId", "name")
      .lean();

    const materialCount = {};
    const communeCount = {};
    const monthlyCount = {};

    completedRequests.forEach((r) => {
      // Contar materiales
      r.items?.forEach((item) => {
        materialCount[item.material] = (materialCount[item.material] || 0) + item.quantity;
      });

      // Contar por mes
      const month = new Date(r.createdAt).toLocaleString("es-CL", { month: "short" });
      monthlyCount[month] = (monthlyCount[month] || 0) + 1;

      // Contar por comuna
      if (r.address) {
        const comuna = r.address.split(",")[0]?.trim() || "Desconocida";
        communeCount[comuna] = (communeCount[comuna] || 0) + 1;
      }
    });

    // ✅ Ordenar los meses correctamente
    const monthsOrder = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const monthly = Object.entries(monthlyCount)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month));

    // ✅ Preparar datos finales
   const MATERIALS_LABELS = {
    glass: "Vidrio",
    paper: "Papel",
    paperboard: "Cartón",
    plastic: "Plástico",
    power_bank: "Pilas",
  };
  
  const data = {
    materials: Object.entries(materialCount).map(([name, value]) => ({
      name: MATERIALS_LABELS[name] || name, // ← traducido al español
      value,
    })),
    communes: Object.entries(communeCount).map(([name, value]) => ({
      name,
      value,
    })),
    monthly,
  };
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener estadísticas." });
  }
};
