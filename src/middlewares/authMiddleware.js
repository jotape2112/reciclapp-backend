import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // Verificar si el token viene en los headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extraer el token
      token = req.headers.authorization.split(" ")[1];

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar el usuario
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Usuario no encontrado" });
      }

      next(); // ✅ Continúa a la siguiente función
    } catch (error) {
      console.error("Error en authMiddleware:", error);
      res.status(401).json({ message: "Token no válido o expirado" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "No se proporcionó token de autenticación" });
  }
};
