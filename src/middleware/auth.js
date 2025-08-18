import jwt from "jsonwebtoken";

export const requireAuth = (roles = []) => (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "No token" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    if (roles.length && !roles.includes(payload.role)) {
      return res.status(403).json({ msg: "Prohibido" });
    }
    next();
  } catch (e) {
    return res.status(401).json({ msg: "Token inválido" });
  }
};
