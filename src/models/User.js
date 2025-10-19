import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["usuario", "empresa", "admin"], default: "usuario" },
}, { timestamps: true });

// 👇 Exportación compatible con ES Modules
const User = mongoose.model("User", userSchema);
export default User;
