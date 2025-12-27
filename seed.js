import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Group from "./models/Group.js";
import Student from "./models/Student.js";
import GroupMembership from "./models/GroupMembership.js";
import Attendance from "./models/Attendance.js";
import Grade from "./models/Grade.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // 1. Очищення бази (опціонально, розкоментуйте, якщо треба)
    // await Student.deleteMany({});
    // await GroupMembership.deleteMany({});
    // await Attendance.deleteMany({});
    // await Grade.deleteMany({});

    // 2. Отримуємо або створюємо викладача (для посилань marked_by / given_by)
    let teacher = await User.findOne({ role: "teacher" });
    if (!teacher) {
        // Якщо викладача немає, краще створити його через API або вручну, 
        // але тут візьмемо першого адміна як заглушку
        teacher = await User.findOne({ role: "admin" }); 
    }
    const teacherId = teacher ? teacher._id : new mongoose.Types.ObjectId(); 

    // 3. Знаходимо або створюємо Групу
    // Використовуємо існуючу групу або створюємо нову
    let group = await Group.findOne({ name: "Hip-Hop Початківці" });
    if (!group) {
        group = await Group.create({
            name: "Hip-Hop Початківці",
            schedule: "Понеділок і середа о 18:00", // Або ваш новий формат масиву
            teacher_id: teacherId
        });
        console.log("Групу створено:", group.name);
    } else {
        console.log("Використовуємо групу:", group.name);
    }

    // 4. Створюємо Студентів
    const studentsData = [
        { full_name: "Олександр Коваленко", email: "alex@example.com", phone: "+380991111111" },
        { full_name: "Марія Іваненко", email: "maria@example.com", phone: "+380992222222" },
        { full_name: "Дмитро Сидоренко", email: "dmytro@example.com", phone: "+380993333333" },
        { full_name: "Анна Петренко", email: "anna@example.com", phone: "+380994444444" },
    ];

    const createdStudents = [];
    for (const s of studentsData) {
        // Перевіряємо, чи студент вже існує, щоб не дублювати
        let student = await Student.findOne({ email: s.email });
        if (!student) {
            student = await Student.create(s);
            console.log("Студента додано:", student.full_name);
        }
        createdStudents.push(student);
    }

    // 5. Записуємо студентів у Групу (GroupMembership)
    const memberships = [];
    for (const student of createdStudents) {
        let membership = await GroupMembership.findOne({ group_id: group._id, student_id: student._id });
        if (!membership) {
            membership = await GroupMembership.create({
                group_id: group._id,
                student_id: student._id,
                join_date: new Date()
            });
            console.log(`Студента ${student.full_name} записано в групу`);
        }
        memberships.push(membership);
    }

    // Дати занять для генерації (наприклад, 3 останні заняття)
    const lessonDates = [
        new Date("2025-05-12T19:00:00"),
        new Date("2025-05-14T19:00:00"),
        new Date("2025-05-19T19:00:00")
    ];

    // 6. Генеруємо Відвідуваність (Attendance)
    for (const date of lessonDates) {
        for (const membership of memberships) {
            // Випадковий статус: 80% present, 10% absent, 10% late
            const rand = Math.random();
            let status = "present";
            if (rand > 0.8) status = "absent";
            else if (rand > 0.9) status = "late";

            await Attendance.create({
                membership_id: membership._id,
                lesson_date: date,
                status: status,
                marked_by: teacherId
            });
        }
    }
    console.log("Дані про відвідуваність згенеровано");

    // 7. Генеруємо Оцінки (Grades)
    // Ставимо оцінки тільки за останнє заняття
    const gradingDate = lessonDates[lessonDates.length - 1];
    
    for (const membership of memberships) {
        // Випадкова оцінка від 60 до 100
        const score = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
        
        await Grade.create({
            membership_id: membership._id,
            lesson_date: gradingDate,
            score: score,
            comment: score > 90 ? "Чудова робота!" : "Треба ще потренуватися",
            given_by: teacherId
        });
    }
    console.log("Оцінки згенеровано");

    console.log("==== Успішно завершено! ====");
    process.exit();

  } catch (err) {
    console.error("Помилка:", err);
    process.exit(1);
  }
};

seedData();