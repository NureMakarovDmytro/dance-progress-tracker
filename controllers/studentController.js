import Student from "../models/Student.js";
import GroupMembership from "../models/GroupMembership.js";

export const createStudent = async (req, res) => {
  try {
    const { full_name, birth_date, phone, email, notes } = req.body;
    const student = new Student({ full_name, birth_date, phone, email, notes });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const enrollStudentToGroup = async (req, res) => {
  try {
    const { student_id, group_id } = req.body;
    const membership = new GroupMembership({ student_id, group_id });
    await membership.save();
    res.status(201).json({ message: "Учень записаний до групи", membership });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const { groupId } = req.query;
    if (groupId) {
      const memberships = await GroupMembership.find({ group_id: groupId }).populate("student_id");
      const students = memberships.map(m => m.student_id);
      res.json(students);
    } else {
      const students = await Student.find();
      res.json(students);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};