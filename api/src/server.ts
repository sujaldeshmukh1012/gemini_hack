import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import { sql } from "drizzle-orm";
import { db } from "./db/index.js";
import { seed } from "./db/seed.js";
import { seedLessons } from "./db/seedLessons.js";
import usersRouter from "./routes/users.js";
import accountsRouter from "./routes/accounts.js";
import parseSourceRouter from "./routes/parse_source.js";
import brailleRouter from "./routes/braille.js";
import lessonsRouter from "./routes/lessons.js";
import curriculumRouter from "./routes/curriculum.js";
import adminRouter from "./routes/admin.js";
import uploadRouter from "./routes/upload.js";

const app = express();
// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


app.use(
  session({
    secret: process.env.SESSION_SECRET || "learnlens-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());

app.use("/users", usersRouter);
app.use("/api/auth", accountsRouter);
app.use("/api/parse", parseSourceRouter);
app.use("/api/braille", brailleRouter);
app.use("/api/lessons", lessonsRouter);
app.use("/api/curriculum", curriculumRouter);
app.use("/api/admin", adminRouter);
app.use("/api/upload", uploadRouter);

async function startServer() {
  const PORT = process.env.PORT || 8000;

  const requiredEnvVars = [
    "DATABASE_URL",
    "GEMINI_API_KEY",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName] || process.env[varName]?.trim() === ""
  );

  if (missingEnvVars.length > 0) {
    console.error("Missing required environment variables!");
    console.error(
      `The following environment variables are not set: ${missingEnvVars.join(", ")}`
    );
    console.error(
      "Please set these variables in your .env file or environment."
    );
    process.exit(1);
  }

  console.log("All required environment variables are set");

  // Database connection check
  try {
    await db.execute(sql`SELECT 1`);
    console.log("Connected to database");
  } catch (error) {
    console.error("Database connection error:", error);
    console.error("Could not connect to database. Did you run docker compose up?");
    process.exit(1);
  }

  // Seed database with default data (curricula, classes, subjects, chapters)
  try {
    console.log("Seeding database...");
    await seed();
    console.log("Basic seed data created");
  } catch (error) {
    console.error("Error creating default seed data!");
    console.error(error);
    process.exit(1);
  }

  // Seed lessons from JSON files
  try {
    console.log("Seeding lessons from JSON files...");
    await seedLessons();
    console.log("Lesson seeding complete");
  } catch (error) {
    console.warn("Lesson seeding failed or skipped (this is optional):", error);
    // Don't exit - lesson seeding is optional
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
