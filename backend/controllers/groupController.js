import Group from "../models/group.js";

export const createGroup = async (req, res) => {
  try {
    const { name, schedule } = req.body;

    const group = new Group({
      name,
      schedule,
      teacher_id: req.user.id  // використовуємо ID адміна як викладача (тимчасово)
    });

    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate("teacher_id", "full_name");
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};