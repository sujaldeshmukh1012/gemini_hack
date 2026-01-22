/**
 * Tool/Function declarations for Gemini Live API
 */
import { Type, FunctionDeclaration } from '@google/genai';

export const toolDeclarations: FunctionDeclaration[] = [
  {
    name: "navigate",
    description: "Navigate to a page in the application (dashboard, home, or setup)",
    parameters: {
      type: Type.OBJECT,
      properties: {
        destination: {
          type: Type.STRING,
          description: "The page to navigate to: dashboard, home, or setup"
        }
      },
      required: ["destination"]
    }
  },
  {
    name: "openLesson",
    description: "Open a specific lesson by subject and chapter number",
    parameters: {
      type: Type.OBJECT,
      properties: {
        subject: {
          type: Type.STRING,
          description: "The subject name such as physics, mathematics, chemistry, biology"
        },
        chapterNumber: {
          type: Type.NUMBER,
          description: "The chapter number starting from 1"
        }
      },
      required: ["subject", "chapterNumber"]
    }
  },
  {
    name: "lessonControl",
    description: "Control lesson playback with actions: play, pause, resume, stop, next, or previous",
    parameters: {
      type: Type.OBJECT,
      properties: {
        action: {
          type: Type.STRING,
          description: "The playback control action: play, pause, resume, stop, next, or previous"
        }
      },
      required: ["action"]
    }
  },
  {
    name: "listSubjects",
    description: "List all available subjects for the user",
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: "listChapters",
    description: "List all available chapters, optionally filtered by a specific subject",
    parameters: {
      type: Type.OBJECT,
      properties: {
        subject: {
          type: Type.STRING,
          description: "Optional subject name to filter chapters by"
        }
      }
    }
  }
];
