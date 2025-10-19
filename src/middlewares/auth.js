const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Acceso denegado, no hay token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // guarda el id del usuario en req.user
    next();
  } catch (error) {
    res.status(400).json({ message: "Token inválido" });
  }
};

module.exports = auth;
