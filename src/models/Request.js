import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    items: [
      {
        material: { type: String, required: true }, // ej: "glass"
        quantity: { type: Number, default: 1 },
        unit: { type: String, default: "unidad" },  // ej: "kilos", "bolsas"
      },
    ],

    address: { type: String, required: true },
    schedule: { type: String, required: true },
    status: {
      type: String,
      enum: ["pendiente", "aceptada", "rechazada", "completada"],
      default: "pendiente",
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);
export default Request;

