import { Router } from "express";

const lessonsRouter = Router();

lessonsRouter.post("/", (req, res) => {
  // Placeholder for creating a lesson
  res.status(201).json({ message: "Lesson created" });
});