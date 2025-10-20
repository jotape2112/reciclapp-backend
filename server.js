import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userroutes.js";
import requestRoutes from "./src/routes/requestRoutes.js";
import cors from "cors";

dotenv.config();
const app = express();

// ✅ Lista de dominios permitidos
const allowedOrigins = [
  "http://localhost:5173", // desarrollo local
  "https://reciclap.netlify.app", // producción en Netlify
];

// ✅ Configuración de CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS no permitido por seguridad"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Rutas
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);

// ✅ Conexión a MongoDB
connectDB();

// ✅ Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
