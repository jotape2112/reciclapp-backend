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

// 🌍 Lista de orígenes permitidos EN PRODUCCIÓN
const allowedOrigins = [
  "https://reciclap.netlify.app",  // dominio oficial
];

// 🧩 Configuración global de CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Permite solicitudes sin origin (Postman, backend interno, etc.)
      if (!origin) return callback(null, true);

      const isLocalhost = origin.startsWith("http://localhost");
      const isEmulator = origin.startsWith("http://10.0.2.2");
      const isProduction = allowedOrigins.includes(origin);

      // Si NO coincide con localhost, emulador o producción → bloquear
      if (!isLocalhost && !isEmulator && !isProduction) {
        console.log(`❌ CORS bloqueó solicitud desde: ${origin}`);
        return callback(
          new Error(`CORS bloqueó acceso desde dominio no permitido: ${origin}`),
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
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
);
