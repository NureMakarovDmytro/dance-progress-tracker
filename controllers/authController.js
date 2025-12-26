import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res) => {
  try {
    const { full_name, login, password } = req.body;
    const existing = await User.findOne({ login });
    if (existing) return res.status(400).json({ message: "Користувач вже існує" });
    const hashed = await bcrypt.hash(password, 10);
    const admin = new User({ full_name, login, password_hash: hashed, role: "admin" });
    await admin.save();
    res.status(201).json({ message: "Адміністратор створений" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({ login });
    if (!user) return res.status(400).json({ message: "Невірний логін" });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ message: "Невірний пароль" });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, full_name: user.full_name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};