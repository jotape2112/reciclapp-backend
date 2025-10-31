
import mongoose from "mongoose";

const pointSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  materials: [{ type: String }],
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Point = mongoose.model("Point", pointSchema);
export default Point;
