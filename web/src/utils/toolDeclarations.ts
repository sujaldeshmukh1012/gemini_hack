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
          description: "The page to navigate to: dashboard, home, setup, accessibility-guide"
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
        },
        lessonNumber: {
          type: Type.NUMBER,
          description: "The lesson or section number within the chapter, starting from 1"
        },
        contentType: {
          type: Type.STRING,
          description: "The type of content to open: article, video, quiz, or practice"
        }
      },
      required: ["chapterNumber"]
    }
  },
  {
    name: "openChapter",
    description: "Open a chapter (chapter overview page) by subject and chapter number",
    parameters: {
      type: Type.OBJECT,
      properties: {
        subject: {
          type: Type.STRING,
          description: "Optional subject name such as physics, mathematics, chemistry, biology"
        },
        chapterNumber: {
          type: Type.NUMBER,
          description: "The chapter number starting from 1"
        }
      },
      required: ["chapterNumber"]
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
  },
  {
    name: "convertBraille",
    description: "Convert the current lesson or page content to Braille",
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: "toggleFocusMode",
    description: "Enable or disable focus mode for distraction-free learning",
    parameters: {
      type: Type.OBJECT,
      properties: {
        enabled: {
          type: Type.BOOLEAN,
          description: "Optional: true to enable, false to disable. If omitted, toggles."
        }
      }
    }
  },
  {
    name: "openStoryMode",
    description: "Open story mode for the current topic/lesson",
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: "openBraille",
    description: "Open braille output for the current topic/lesson",
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: "setLanguage",
    description: "Set the app language (English, Spanish, Hindi).",
    parameters: {
      type: Type.OBJECT,
      properties: {
        language: {
          type: Type.STRING,
          description: "Language code: en, es, hi"
        }
      },
      required: ["language"]
    }
  },
  {
    name: "toggleLargeText",
    description: "Toggle Large Text mode in the top bar.",
    parameters: { type: Type.OBJECT, properties: {} }
  },
  {
    name: "toggleCaptions",
    description: "Toggle Captions mode in the top bar.",
    parameters: { type: Type.OBJECT, properties: {} }
  },
  {
    name: "toggleSigns",
    description: "Toggle Signs mode in the top bar.",
    parameters: { type: Type.OBJECT, properties: {} }
  },
  {
    name: "toggleReduceMotion",
    description: "Toggle Calm Motion / Reduce Motion mode in the top bar.",
    parameters: { type: Type.OBJECT, properties: {} }
  },
  {
    name: "quizSelectOption",
    description: "Select a quiz/practice answer option. Example: questionNumber=1 and option='A' or option='true'. If questionNumber is omitted, selects for the first unanswered question.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        questionNumber: {
          type: Type.NUMBER,
          description: "1-based question number (optional)"
        },
        option: {
          type: Type.STRING,
          description: "Option to pick: A, B, C, D... or true/false"
        },
        optionText: {
          type: Type.STRING,
          description: "Optional: match an option by text (case-insensitive substring match)."
        }
      }
    }
  },
  {
    name: "quizSubmit",
    description: "Submit the current quiz/practice if all questions are answered.",
    parameters: { type: Type.OBJECT, properties: {} }
  },
  {
    name: "scrollPage",
    description: "Scroll the current page (up/down/top/bottom). Use this for 'scroll down a bit' style requests.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        direction: {
          type: Type.STRING,
          description: "Scroll direction: up, down, top, bottom"
        },
        amountPx: {
          type: Type.NUMBER,
          description: "Optional pixels to scroll for up/down. If omitted, scrolls a sensible default."
        }
      },
      required: ["direction"]
    }
  },
  {
    name: "navigateHistory",
    description: "Navigate browser history within the app. Use delta=-1 for back, delta=1 for forward.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        delta: {
          type: Type.NUMBER,
          description: "History delta. Example: -1 (back), 1 (forward)"
        }
      },
      required: ["delta"]
    }
  }
];
