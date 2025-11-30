import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    items: [
      {
        material: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        unit: { type: String, default: "unidad" },
      },
    ],

    address: { type: String, required: true },
    schedule: { type: String, required: true },

    status: {
      type: String,
      enum: ["pendiente", "aceptada", "rechazada", "completada"],
      default: "pendiente",
    },

    // ⭐ Calificación del servicio
    rating: {
      score: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      ratedAt: { type: Date },
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);
export default Request;
