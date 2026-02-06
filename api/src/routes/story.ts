import { Router } from "express";
import fs from "fs";
import path from "path";
import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  storyAssets,
  storyAudioAssets,
  subjects,
  gradeSubjects,
  chapters,
  lessons as lessonsTable,
} from "../db/schema.js";
import { callGeminiJson, hasGeminiApiKey } from "../utils/gemini.js";
import { generateImage } from "../utils/imageGen.js";
import { saveBase64File, saveBufferFile, storageConfig } from "../utils/storage.js";
import { synthesizeSpeech } from "../utils/tts.js";
import type {
  StructuredSection,
  ArticleMicrosection,
  StorySlide,
  StoryAudioSlide,
} from "../../types/index.js";

const storyRouter = Router();

const SAFE_IMAGE_PREFIX = "Kid-safe educational comic illustration, friendly, bright, clean lines, no text, no logos, no violence, no gore, no adult themes";

type StorySlideDraft = Omit<StorySlide, "index" | "imageUrl">;

export const normalizeLocale = (locale: string) => {
  const cleaned = locale.trim();
  if (cleaned.toLowerCase().startsWith("es")) return "es-ES";
  if (cleaned.toLowerCase().startsWith("hi")) return "hi-IN";
  return "en-US";
};

const translateSlides = async (
  slides: StorySlide[],
  locale: string
): Promise<Array<{ narration: string; caption: string }>> => {
  if (locale.startsWith("en")) {
    return slides.map((slide) => ({
      narration: slide.narration,
      caption: slide.caption,
    }));
  }

  const prompt = `Translate the slide narrations and captions into ${locale}. Return ONLY JSON.

Input:
${JSON.stringify(slides.map((s) => ({ narration: s.narration, caption: s.caption })))}

Output JSON format:
{
  "slides": [
    { "narration": "...", "caption": "..." }
  ]
}

Rules:
- Keep meaning accurate and educational.
- Keep captions short (<= 12 words).
- Return ONLY JSON.`;

  const result = await callGeminiJson<{ slides: Array<{ narration: string; caption: string }> }>(prompt);
  if (!result?.slides || result.slides.length !== slides.length) {
    throw new Error("Failed to translate slides");
  }
  return result.slides;
};

const buildStoryKey = (classId: string, subjectId: string, chapterSlug: string, sectionSlug: string) => {
  return `${classId}::${subjectId}::${chapterSlug}::${sectionSlug}`;
};

storyRouter.get("/config/storage", (_req, res) => {
  return res.json({
    provider: storageConfig.provider,
    publicBaseUrl: storageConfig.publicBaseUrl,
  });
});

const truncate = (value: string, max = 1200) => {
  if (!value) return "";
  return value.length > max ? `${value.slice(0, max)}...` : value;
};

const getArticleMicrosection = (section: StructuredSection): ArticleMicrosection | null => {
  const article = section.microsections.find(
    (microsection) => microsection.type === "article"
  ) as ArticleMicrosection | undefined;

  return article || null;
};

const buildStoryPrompt = (
  section: StructuredSection,
  article: ArticleMicrosection,
  chapterTitle: string
) => {
  const input = {
    chapterTitle,
    sectionTitle: section.title,
    sectionDescription: truncate(section.description || ""),
    articleTitle: article.title,
    introduction: truncate(article.content.introduction || ""),
    coreConcepts: article.content.coreConcepts.map((concept) => ({
      conceptTitle: concept.conceptTitle,
      explanation: truncate(concept.explanation, 800),
      example: truncate(concept.example || "", 500),
    })),
    summary: article.content.summary.map((point) => truncate(point, 200)),
  };

  return `You are an expert educator and storyteller.

Task:
Create a kid-safe, engaging comic-style story that teaches the topic clearly.
The story should be broken into slides (like panels). Each slide has narration, a short caption, and an image prompt.

Output JSON format (ONLY JSON):
{
  "slides": [
    {
      "id": "slide-1",
      "title": "<short title>",
      "narration": "<2-4 sentences, clear and friendly>",
      "caption": "<short caption, <= 12 words>",
      "imagePrompt": "<prompt for a kid-safe illustration>",
      "signKeywords": ["<1-3 simple keywords>"]
    }
  ]
}

Rules:
- 5 to 8 slides.
- Keep narration concise and age-appropriate.
- Captions must always be present.
- Image prompts must be kid-safe, no violence, no scary content, no adult themes.
- Do NOT include text within the image (no labels, no captions in the image).
- Avoid brand names.
- Use friendly, diverse characters.

Input JSON:
${JSON.stringify(input)}

Return ONLY the JSON object, no extra text.`;
};

storyRouter.get("/:classId/:subjectId/:chapterSlug/:sectionSlug", async (req, res) => {
  try {
    const { classId, subjectId, chapterSlug, sectionSlug } = req.params;
    const storyKey = buildStoryKey(classId, subjectId, chapterSlug, sectionSlug);

    const [existing] = await db
      .select()
      .from(storyAssets)
      .where(eq(storyAssets.storyKey, storyKey))
      .limit(1);

    if (!existing) {
      return res.status(404).json({ error: "Story not generated" });
    }

    return res.json(existing);
  } catch (error) {
    console.error("Error fetching story:", error);
    return res.status(500).json({ error: "Failed to fetch story" });
  }
});

storyRouter.post("/generate", async (req, res) => {
  let storyRecord: typeof storyAssets.$inferSelect | undefined;
  try {
    if (!hasGeminiApiKey()) {
      return res.status(500).json({
        error: "Gemini API key is not configured. Please set GEMINI_API_KEY.",
      });
    }

    const { classId, subjectId, chapterSlug, sectionSlug, force } = req.body as {
      classId: string;
      subjectId: string;
      chapterSlug: string;
      sectionSlug: string;
      force?: boolean;
    };

    if (!classId || !subjectId || !chapterSlug || !sectionSlug) {
      return res.status(400).json({
        error: "classId, subjectId, chapterSlug, and sectionSlug are required",
      });
    }

    const storyKey = buildStoryKey(classId, subjectId, chapterSlug, sectionSlug);

    const [existing] = await db
      .select()
      .from(storyAssets)
      .where(eq(storyAssets.storyKey, storyKey))
      .limit(1);

    if (existing && existing.status === "ready" && !force) {
      return res.json(existing);
    }

    // Load the section from the DB to ensure it matches what the UI is showing.
    const [subject] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.slug, subjectId))
      .limit(1);
    if (!subject) {
      return res.status(404).json({ error: `Subject '${subjectId}' not found` });
    }

    const [gradeSubject] = await db
      .select()
      .from(gradeSubjects)
      .where(
        and(eq(gradeSubjects.classId, classId), eq(gradeSubjects.subjectId, subject.id))
      )
      .limit(1);

    if (!gradeSubject) {
      return res.status(404).json({ error: "GradeSubject not found for class and subject" });
    }

    const [chapter] = await db
      .select()
      .from(chapters)
      .where(
        and(eq(chapters.gradeSubjectId, gradeSubject.id), eq(chapters.slug, chapterSlug))
      )
      .limit(1);

    if (!chapter) {
      return res.status(404).json({ error: `Chapter '${chapterSlug}' not found` });
    }

    const [lesson] = await db
      .select()
      .from(lessonsTable)
      .where(and(eq(lessonsTable.chapterId, chapter.id), eq(lessonsTable.slug, sectionSlug)))
      .limit(1);

    if (!lesson) {
      return res.status(404).json({ error: `Section '${sectionSlug}' not found` });
    }

    const lessonContent = lesson.content as any;
    const microsections = Array.isArray(lessonContent?.microsections)
      ? (lessonContent.microsections as any[])
      : [];

    const section = {
      ...(lessonContent || {}),
      id: lessonContent?.id || sectionSlug,
      slug: lessonContent?.slug || sectionSlug,
      title: lesson.title || lessonContent?.title || "Section",
      description: lessonContent?.description || "",
      microsections,
    } as StructuredSection;

    const article = getArticleMicrosection(section);
    if (!article) {
      return res.status(400).json({ error: "Article content not available for this section" });
    }

    storyRecord = existing;
    if (!storyRecord) {
      [storyRecord] = await db
        .insert(storyAssets)
        .values({
          storyKey,
          classId,
          subjectId,
          chapterSlug,
          sectionSlug,
          microsectionId: article.id,
          status: "pending",
          renderType: "slides",
          slides: [],
        })
        .returning();
    }

    const prompt = buildStoryPrompt(section, article, chapter.name);
    const storyJson = await callGeminiJson<{ slides: StorySlideDraft[] }>(prompt);

    if (!storyJson || !Array.isArray(storyJson.slides) || storyJson.slides.length === 0) {
      await db
        .update(storyAssets)
        .set({ status: "error", error: "Failed to generate slides" })
        .where(eq(storyAssets.id, storyRecord.id));

      return res.status(500).json({ error: "Failed to generate story slides" });
    }

    const storyDir = path.join("stories", storyRecord.id);

    const slidesWithImages: StorySlide[] = [];
    const rawSlides = storyJson.slides.slice(0, 8);
    for (let i = 0; i < rawSlides.length; i++) {
      const slide = rawSlides[i];
      const slideIndex = i + 1;
      const imagePrompt = slide.imagePrompt?.trim() || `${section.title} illustration`;
      const safePrompt = `${SAFE_IMAGE_PREFIX}. ${imagePrompt}`;

      const [imageBytes] = await generateImage(safePrompt, 1);
      const fileName = `slide-${String(slideIndex).padStart(2, "0")}.png`;

      const saved = await saveBase64File(imageBytes, path.join(storyDir, fileName));

      slidesWithImages.push({
        id: slide.id || `slide-${slideIndex}`,
        index: slideIndex,
        title: slide.title || `Slide ${slideIndex}`,
        narration: slide.narration || "",
        caption: slide.caption || slide.title || `Slide ${slideIndex}`,
        imagePrompt: slide.imagePrompt || imagePrompt,
        signKeywords: slide.signKeywords || [],
        imageUrl: saved.publicUrl,
      });
    }

    const manifest = {
      id: storyRecord.id,
      storyKey,
      renderType: "slides",
      slides: slidesWithImages,
    };

    if (storageConfig.provider === "local") {
      const manifestPath = path.join(storageConfig.localRoot, storyDir, "manifest.json");
      await fs.promises.mkdir(path.dirname(manifestPath), { recursive: true });
      await fs.promises.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
    }
    const manifestUrl = `${storageConfig.publicBaseUrl}/${storyDir}/manifest.json`;

    const [updated] = await db
      .update(storyAssets)
      .set({
        status: "ready",
        slides: slidesWithImages,
        updatedAt: new Date(),
        renderType: "slides",
        videoUrl: manifestUrl,
      })
      .where(eq(storyAssets.id, storyRecord.id))
      .returning();

    return res.json(updated);
  } catch (error) {
    console.error("Error generating story:", error);
    if (storyRecord?.id) {
      await db
        .update(storyAssets)
        .set({
          status: "error",
          error: error instanceof Error ? error.message : String(error),
          updatedAt: new Date(),
        })
        .where(eq(storyAssets.id, storyRecord.id));
    }
    return res.status(500).json({ error: "Failed to generate story" });
  }
});

storyRouter.post("/audio", async (req, res) => {
  let audioRecord: typeof storyAudioAssets.$inferSelect | undefined;
  try {
    console.log("[story/audio] request", req.body);
    if (!hasGeminiApiKey()) {
      return res.status(500).json({ error: "Gemini API key is not configured." });
    }

    const { classId, subjectId, chapterSlug, sectionSlug, locale, force } = req.body as {
      classId: string;
      subjectId: string;
      chapterSlug: string;
      sectionSlug: string;
      locale: string;
      force?: boolean;
    };

    if (!classId || !subjectId || !chapterSlug || !sectionSlug) {
      return res.status(400).json({ error: "classId, subjectId, chapterSlug, sectionSlug are required" });
    }

    const storyKey = buildStoryKey(classId, subjectId, chapterSlug, sectionSlug);
    const normalizedLocale = normalizeLocale(locale || "en-US");

    const [story] = await db
      .select()
      .from(storyAssets)
      .where(eq(storyAssets.storyKey, storyKey))
      .limit(1);

    if (!story || story.status !== "ready") {
      return res.status(404).json({ error: "Story not found or not ready" });
    }

    const [existingAudio] = await db
      .select()
      .from(storyAudioAssets)
      .where(and(
        eq(storyAudioAssets.storyId, story.id),
        eq(storyAudioAssets.locale, normalizedLocale),
      ))
      .limit(1);

    if (existingAudio && existingAudio.status === "ready" && !force) {
      console.log("[story/audio] cache hit", { storyId: story.id, locale: normalizedLocale });
      return res.json({ story, audio: existingAudio });
    }

    audioRecord = existingAudio;
    if (audioRecord && force) {
      await db
        .update(storyAudioAssets)
        .set({
          status: "pending",
          slides: [],
          error: null,
          updatedAt: new Date(),
        })
        .where(eq(storyAudioAssets.id, audioRecord.id));
    }
    if (!audioRecord) {
      const inserted = await db
        .insert(storyAudioAssets)
        .values({
          storyId: story.id,
          locale: normalizedLocale,
          status: "pending",
          slides: [],
        })
        .onConflictDoNothing()
        .returning();

      if (inserted.length > 0) {
        audioRecord = inserted[0];
      } else {
        [audioRecord] = await db
          .select()
          .from(storyAudioAssets)
          .where(and(
            eq(storyAudioAssets.storyId, story.id),
            eq(storyAudioAssets.locale, normalizedLocale),
          ))
          .limit(1);
      }
    }

    const translated = await translateSlides(story.slides as StorySlide[], normalizedLocale);
    const audioSlides: StoryAudioSlide[] = [];
    const audioDir = path.join("stories", story.id, "audio", normalizedLocale);

    for (let i = 0; i < story.slides.length; i++) {
      const slide = story.slides[i] as StorySlide;
      const translation = translated[i];
      const narrationText = translation.narration?.trim() || translation.caption || slide.title || " ";
      console.log("[story/audio] slide", i + 1, "chars", narrationText.length);
      const audioBuffer = await synthesizeSpeech(narrationText, {
        languageCode: normalizedLocale,
      });
      const fileName = `slide-${String(i + 1).padStart(2, "0")}.wav`;
      const saved = await saveBufferFile(audioBuffer, path.join(audioDir, fileName));

      audioSlides.push({
        slideId: slide.id,
        narration: narrationText,
        caption: translation.caption || narrationText,
        audioUrl: saved.publicUrl,
      });
    }

    const [updatedAudio] = await db
      .update(storyAudioAssets)
      .set({
        status: "ready",
        slides: audioSlides as any,
        updatedAt: new Date(),
      })
      .where(eq(storyAudioAssets.id, audioRecord.id))
      .returning();

    return res.json({ story, audio: updatedAudio });
  } catch (error) {
    console.error("Error generating story audio:", error);
    if (audioRecord?.id) {
      await db
        .update(storyAudioAssets)
        .set({
          status: "error",
          error: error instanceof Error ? error.message : String(error),
          updatedAt: new Date(),
        })
        .where(eq(storyAudioAssets.id, audioRecord.id));
    }
    return res.status(500).json({ error: "Failed to generate story audio" });
  }
});

export default storyRouter;
