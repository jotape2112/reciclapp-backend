import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del punto es obligatorio"],
    },
    address: {
      type: String,
      required: [true, "La dirección es obligatoria"],
    },
    lat: {
      type: Number,
      required: [true, "La latitud es obligatoria"],
    },
    lng: {
      type: Number,
      required: [true, "La longitud es obligatoria"],
    },
    materials: {
      type: [String],
      required: true,
      default: [],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // quién lo creó (empresa)
    },
  },
  { timestamps: true }
);

const Point = mongoose.model("Point", pointSchema);
export default Point;
