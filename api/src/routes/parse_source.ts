import { Router } from "express";
import type { Request, Response } from "express";
import multer from "multer";
import type { Chapter } from "../utils/parseSource.js";
import {
  parsePdfBuffer,
  parseSourceText,
  parseSourceWithGemini,
  enrichChapterWithGemini,
  hasGeminiApiKey,
} from "../utils/parseSource.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.post("/parse_pdf", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const file = (req as Request & { file?: Express.Multer.File }).file;
    if (!file) {
      return res.status(400).json({ error: "Upload a PDF file with field name 'file'" });
    }
    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "Only PDF files are supported" });
    }

    const text = await parsePdfBuffer(file.buffer);
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "No text found in PDF" });
    }

    let chapters: Chapter[] = [];
    if (hasGeminiApiKey()) {
      chapters = await parseSourceWithGemini(text);
    }
    if (!chapters.length) {
      chapters = parseSourceText(text);
    }

    if (hasGeminiApiKey()) {
      for (const chapter of chapters) {
        await enrichChapterWithGemini(chapter);
      }
    }

    for (const chapter of chapters) {
      for (const section of chapter.Sections) {
        section.content = "";
      }
    }

    res.json(chapters);
  } catch (error) {
    console.error("Error parsing source:", error);
    res.status(500).json({ error: "Failed to parse the source" });
  }
});

export default router;
