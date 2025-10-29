import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔒 Middleware de autenticación
export const protect = async (req, res, next) => {
  let token;

  // Verificar encabezado de autorización
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extraer token
      token = req.headers.authorization.split(" ")[1];

      // Verificar token con la clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar usuario sin incluir la contraseña
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      next(); // continuar con la siguiente función
    } catch (error) {
      console.error("❌ Error en middleware protect:", error.message);
      return res.status(401).json({ message: "Token no válido o expirado" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No se proporcionó token de autorización" });
  }
};
