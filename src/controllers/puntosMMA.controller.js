// src/controllers/puntosMMA.controller.js

const MATERIALS_TRANSLATION = {
  glass: "Vidrio",
  paper: "Papel",
  paperboard: "Cartón",
  cardboard_drink: "Cartón para bebidas",
  plastic: "Plástico",
  metal: "Metal",
  power_bank: "Pilas",
  phone: "Celulares",
};

export const getPuntosMMA = async (req, res) => {
  try {
    const { lat, lng, distance } = req.query;

    // Construimos la URL con parámetros
    const url = new URL("https://puntoslimpios.mma.gob.cl/api/points/geo");
    url.searchParams.set("lat", lat || "-33.4405632");
    url.searchParams.set("lng", lng || "-70.6614779");
    url.searchParams.set("distance", distance || "20");

    // 🔁 Usamos fetch nativo de Node 22 (NO axios, NO require)
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Respuesta no OK del servicio MMA: ${response.status}`);
    }

    const data = await response.json();

    const cleaned = data.map((p, idx) => ({
      id: idx,
      lat: Number(p.lat),
      lng: Number(p.lng),
      direccion: p.address_name || "",
      comuna: p.commune?.name || "",
      region: p.region?.name || "",
      tipo: p.type === "PV" ? "Punto Verde" : "Punto Limpio",
      materiales: (p.materials || []).map(
        (m) => MATERIALS_TRANSLATION[m] || m
      ),
      owner: p.owner || "",
      manager: p.manager || "",
      estado: p.status || "",
      distance: p.distance ? Number(p.distance) : null,
    }));

    res.json(cleaned);
  } catch (error) {
    console.error("Error obteniendo puntos MMA:", error);
    res
      .status(500)
      .json({ message: "Error al obtener puntos de reciclaje oficiales" });
  }
};
