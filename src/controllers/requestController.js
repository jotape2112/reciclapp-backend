// ✅ Obtener estadísticas de solicitudes completadas (para empresas)
export const getStats = async (req, res) => {
  try {
    if (req.user.role !== "empresa" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Solo las empresas pueden ver estadísticas." });
    }

    // Obtener todas las solicitudes completadas
    const completedRequests = await Request.find({ status: "completada" })
      .populate("userId", "name")
      .lean();

    // Objetos para contar
    const materialCount = {};
    const communeCount = {};
    const monthlyCount = {};

    completedRequests.forEach((r) => {
      // Contar materiales reciclados
      r.items?.forEach((item) => {
        materialCount[item.material] = (materialCount[item.material] || 0) + item.quantity;
      });

      // Contar por mes
      const month = new Date(r.createdAt).toLocaleString("es-CL", { month: "short" });
      monthlyCount[month] = (monthlyCount[month] || 0) + 1;

      // Contar por comuna (extraída de la dirección)
      if (r.address) {
        const comuna = r.address.split(",")[0]?.trim() || "Desconocida";
        communeCount[comuna] = (communeCount[comuna] || 0) + 1;
      }
    });

    // Formatear los resultados
    const data = {
      materials: Object.entries(materialCount).map(([name, value]) => ({ name, value })),
      communes: Object.entries(communeCount).map(([name, value]) => ({ name, value })),
      monthly: Object.entries(monthlyCount).map(([month, total]) => ({ month, total })),
    };

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener estadísticas." });
  }
};

