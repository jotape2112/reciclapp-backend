import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userroutes.js";
import requestRoutes from "./src/routes/requestRoutes.js";
import pointRoutes from "./src/routes/pointRoutes.js";
import puntosMMARoutes from "./src/routes/puntosMMA.routes.js";
import cors from "cors";

dotenv.config();
const app = express();

// 🌍 Lista de orígenes permitidos
const allowedOrigins = [
  "https://reciclap.netlify.app",
  "http://localhost:5173",     // pruebas locales
  "http://10.0.2.2:5173",      // 👈 emulador Android
];

// 🧩 Configuración global de CORS
app.use(
  cors({
    origin: function (origin, callback) {

      // Permitir llamadas sin origin (Postman, servidor interno, etc.)
      if (!origin) return callback(null, true);

      // Validar si el origen está permitido
      if (!allowedOrigins.includes(origin)) {
        console.log(`❌ CORS bloqueó solicitud desde: ${origin}`);
        return callback(
          new Error(`CORS bloqueó el acceso desde el dominio: ${origin}`),
          false
        );
      }

      // Origen permitido
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// 📌 Rutas
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/points", pointRoutes);
app.use("/api/puntos-mma", puntosMMARoutes);

// 🚀 Conexión y arranque
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
