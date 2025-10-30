import mongoose from "mongoose";

const pointSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  materials: [{ type: String }],
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Point = mongoose.model("Point", pointSchema);
export default Point;
