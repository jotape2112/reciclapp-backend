import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userroutes.js";
import requestRoutes from "./src/routes/requestRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// 🔹 Configuración de CORS
const allowedOrigins = [
  "https://reciclap.netlify.app", // 👈 tu frontend en Netlify
  "http://localhost:5173"          // 👈 útil para desarrollo local
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite requests sin origin (como desde Postman o Thunder)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `La política CORS bloqueó el acceso desde el dominio: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Permite cookies o headers personalizados (opcional)
  })
);

app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
