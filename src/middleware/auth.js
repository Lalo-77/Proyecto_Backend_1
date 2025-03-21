export const AuthRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "❌ No autorizado. Inicia sesión." });
    }

    if (req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).send("⛔ Acceso denegado. No tienes permisos.");
    }
    next();
  };
};