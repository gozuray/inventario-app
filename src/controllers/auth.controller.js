import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role });
  res.status(201).json({ id: user._id });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Credenciales inválidas" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ msg: "Credenciales inválidas" });
  const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, role: user.role, name: user.name });
};
