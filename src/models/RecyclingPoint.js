const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Ejemplo: "Punto Limpio Plaza Italia"
  address: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  materialsAccepted: [String], // ej: ["Plástico", "Cartón", "Vidrio"]
}, { timestamps: true });

module.exports = mongoose.model('Point', pointSchema);
