import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Empresa que realizará el retiro
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Ubicación exacta
    address: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },

    schedule: { type: String, required: true },

    items: [
      {
        material: { type: String, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],

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
