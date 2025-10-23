import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    materials: { type: [String], required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Point = mongoose.model("Point", pointSchema);
export default Point;
