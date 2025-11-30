import Request from "../models/Request.js";

const MATERIALS_LABELS = {
  glass: "Vidrio",
  paper: "Papel",
  paperboard: "Cartón",
  plastic: "Plástico",
  power_bank: "Pilas",
};

// =========================================================
//  Crear solicitud
// =========================================================
export const createRequest = async (req, res) => {
  try {
    if (req.user.role !== "usuario") {
      return res
        .status(403)
        .json({ message: "Solo los usuarios pueden crear solicitudes." });
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

// =========================================================
//  Ver solicitudes del usuario autenticado
// =========================================================
export const getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener las solicitudes" });
  }
};

// =========================================================
//  Ver todas las solicitudes (empresas/admin)
// =========================================================
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

// =========================================================
//  Actualizar estado (aceptar, rechazar, completar)
// =========================================================
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pendiente",
      "aceptada",
      "rechazada",
      "completada",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado no válido" });
    }

    const updated = await Request.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Solicitud no encontrada" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al actualizar el estado" });
  }
};

// =========================================================
//  Ver historial de solicitudes completadas (empresa/admin)
// =========================================================
export const getCompletedRequests = async (req, res) => {
  try {
    if (req.user.role !== "empresa" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo las empresas pueden ver el historial." });
    }

    const completed = await Request.find({ status: "completada" })
      .populate("userId", "name email")
      .sort({ updatedAt: -1 });

    res.json(completed);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener el historial de solicitudes completadas.",
    });
  }
};

// =========================================================
//  ⭐ Nueva función: Calificar servicio de una solicitud
// =========================================================
export const rateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, comment } = req.body;
    const userId = req.user.id;

    // Validar puntaje
    if (!score || score < 1 || score > 5) {
      return res.status(400).json({
        message: "La calificación debe ser un número entre 1 y 5.",
      });
    }

    const request = await Request.findById(id);
    if (!request)
      return res.status(404).json({ message: "Solicitud no encontrada." });

    // Solo el dueño de la solicitud puede calificar
    if (request.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "No puedes calificar una solicitud que no es tuya." });
    }

    // Solo solicitudes completadas pueden ser calificadas
    if (request.status !== "completada") {
      return res.status(400).json({
        message: "Solo puedes calificar solicitudes completadas.",
      });
    }

    // Evitar recalificar (si quieres permitir editar, quita este bloque)
    if (request.rating?.score) {
      return res
        .status(400)
        .json({ message: "Esta solicitud ya fue calificada." });
    }

    // Guardar calificación
    request.rating = {
      score,
      comment: comment || "",
      ratedAt: new Date(),
    };

    await request.save();

    res.json({ message: "Calificación registrada con éxito.", request });
  } catch (err) {
    console.error("Error al calificar solicitud:", err);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// =========================================================
//  Obtener estadísticas
// =========================================================
export const getStats = async (req, res) => {
  try {
    if (req.user.role !== "empresa" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Solo las empresas pueden ver estadísticas." });
    }

    const completedRequests = await Request.find({ status: "completada" })
      .populate("userId", "name")
      .lean();

    const materialTotals = {};
    const materialUnits = {};
    const communeCount = {};
    const monthlyCount = {};

    completedRequests.forEach((r) => {
      // --- Contar materiales + unidad dominante ---
      r.items?.forEach((item) => {
        const mat = item.material;
        const qty = item.quantity || 1;
        const unit = item.unit || "unidad";

        materialTotals[mat] = (materialTotals[mat] || 0) + qty;

        if (!materialUnits[mat]) materialUnits[mat] = {};
        materialUnits[mat][unit] = (materialUnits[mat][unit] || 0) + 1;
      });

      // --- Contar por mes ---
      const month = new Date(r.createdAt).toLocaleString("es-CL", {
        month: "short",
      });
      monthlyCount[month] = (monthlyCount[month] || 0) + 1;

      // --- Contar por comuna ---
      if (r.address) {
        const parts = r.address.split(",").map((p) => p.trim());
        let rawComuna = parts.length >= 2 ? parts[1] : "Desconocida";

        const tokens = rawComuna.split(/\s+/);
        if (tokens.length > 1 && /^\d+$/.test(tokens[0])) {
          rawComuna = tokens.slice(1).join(" ");
        }

        const comuna = rawComuna || "Desconocida";
        communeCount[comuna] = (communeCount[comuna] || 0) + 1;
      }
    });

    const monthsOrder = [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ];

    const monthly = Object.entries(monthlyCount)
      .map(([month, total]) => ({ month, total }))
      .sort(
        (a, b) => monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month)
      );

    const data = {
      materials: Object.entries(materialTotals).map(([mat, total]) => {
        const unitMap = materialUnits[mat] || {};
        let preferredUnit = "unidad";
        let maxCount = 0;

        Object.entries(unitMap).forEach(([u, c]) => {
          if (c > maxCount) {
            maxCount = c;
            preferredUnit = u;
          }
        });

        return {
          name: MATERIALS_LABELS[mat] || mat,
          value: total,
          unit: preferredUnit,
        };
      }),

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
