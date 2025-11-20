// src/controllers/puntosMMA.controller.js
const axios = require("axios"); // <-- OK porque ya funcionaba antes con require()

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

const getPuntosMMA = async (req, res) => {
  try {
    const { lat, lng, distance } = req.query;

    const response = await axios.get(
      "https://puntoslimpios.mma.gob.cl/api/points/geo",
      {
        params: {
          lat: lat || -33.4405632,
          lng: lng || -70.6614779,
          distance: distance || 20,
        },
      }
    );

    const data = response.data;

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
    }));

    res.json(cleaned);
  } catch (error) {
    console.error("Error al obtener puntos MMA:", error.message);
    res.status(500).json({ message: "Error al obtener puntos de reciclaje oficiales" });
  }
};

export { getPuntosMMA };

