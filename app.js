import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import authRoutes from "./routes/auth.js";
import groupRoutes from "./routes/groups.js";
import studentRoutes from "./routes/students.js";
import adminRoutes from "./routes/admin.js";
import iotRoutes from "./routes/iot.js";
dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>DanceProgressTracker API працює!</h1><p>Документація: <a href='/api-docs'>/api-docs</a></p>");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/iot", iotRoutes);
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});