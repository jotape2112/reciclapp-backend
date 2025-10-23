import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userroutes.js";
import requestRoutes from "./src/routes/requestRoutes.js";
import pointRoutes from "./routes/pointRoutes.js";
import cors from "cors";


dotenv.config();
const app = express();

// 🌍 Lista de orígenes permitidos
const allowedOrigins = [
  "https://reciclap.netlify.app",
  "http://localhost:5173", // para pruebas locales
];

// 🧩 Configuración global de CORS
app.use(
  cors({
    origin: function (origin, callback) {
      // Permite requests sin origin (como desde Postman o Thunder)
      if (!origin) return callback(null, true);

      if (!allowedOrigins.includes(origin)) {
        return callback(
          new Error(`CORS bloqueó el acceso desde el dominio: ${origin}`),
          false
        );
      }

      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/points", pointRoutes);

// Conexión y arranque
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
