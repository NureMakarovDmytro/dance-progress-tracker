import User from "../models/User.js";
import Group from "../models/Group.js";
import Attendance from "../models/Attendance.js";
import Grade from "../models/Grade.js";
import Report from "../models/Report.js";
import bcrypt from "bcryptjs";

export const createTeacher = async (req, res) => {
  try {
    const { full_name, login, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const teacher = new User({ full_name, login, password_hash: hashed, role: "teacher" });
    await teacher.save();
    res.status(201).json(teacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Користувач видалено" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const calculateStatistics = async (req, res) => {
  try {
    const { groupId } = req.params;
    const memberships = await GroupMembership.find({ group_id: groupId });
    const studentIds = memberships.map(m => m.student_id);
    const attendances = await Attendance.find({ membership_id: { $in: memberships.map(m => m._id) } });
    const grades = await Grade.find({ membership_id: { $in: memberships.map(m => m._id) } });

    const absents = attendances.filter(a => a.status === "absent").length;
    const averageGrade = grades.length > 0 ? grades.reduce((sum, g) => sum + g.score, 0) / grades.length : 0;

    res.json({ absents, averageGrade, totalStudents: studentIds.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const generateReport = async (req, res) => {
  try {
    const { groupId, period_start, period_end } = req.query;
    const filter = groupId ? { group_id: groupId } : {};
    if (period_start) filter.lesson_date = { ...filter.lesson_date, $gte: new Date(period_start) };
    if (period_end) filter.lesson_date = { ...filter.lesson_date, $lte: new Date(period_end) };

    const attendances = await Attendance.find(filter);
    const grades = await Grade.find(filter);

    const report = new Report({
      title: groupId ? `Звіт по групі ${groupId}` : "Звіт по всім групам",
      group_id: groupId || null,
      period_start: period_start || null,
      period_end: period_end || null,
      summary: `Пропусків: ${attendances.filter(a => a.status === "absent").length}, Середній бал: ${grades.length > 0 ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(2) : 0}`,
      generated_by: req.user.id
    });
    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};