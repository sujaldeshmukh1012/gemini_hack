/**
 * Voice command parsing and intent recognition
 * Handles natural language commands for navigation, lesson control, and discovery
 */

export type CommandType = 
  | 'navigate'
  | 'lesson_control'
  | 'discovery'
  | 'unknown';

export type NavigateAction = 
  | 'dashboard'
  | 'home'
  | 'setup'
  | 'chapter'
  | 'lesson';

export type LessonControlAction = 
  | 'play'
  | 'pause'
  | 'resume'
  | 'stop'
  | 'next'
  | 'previous';

export type DiscoveryAction = 
  | 'list_chapters'
  | 'list_subjects'
  | 'current_lesson'
  | 'help';

export interface Command {
  type: CommandType;
  action?: NavigateAction | LessonControlAction | DiscoveryAction;
  params?: {
    subject?: string;
    chapterNumber?: number;
    lessonNumber?: number;
    chapterId?: string;
    route?: string;
  };
  confidence: number;
  rawTranscript: string;
}

/**
 * Normalizes text for matching (lowercase, remove punctuation)
 */
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Extracts numbers from text
 */
const extractNumber = (text: string): number | null => {
  const match = text.match(/\b(\d+)\b/);
  return match ? parseInt(match[1], 10) : null;
};

/**
 * Finds subject name in text
 */
const extractSubject = (text: string, availableSubjects: string[] = []): string | null => {
  const normalized = normalizeText(text);
  
  // Common subject names
  const subjectKeywords: Record<string, string[]> = {
    'physics': ['physics', 'phy'],
    'mathematics': ['mathematics', 'math', 'maths'],
    'chemistry': ['chemistry', 'chem'],
    'biology': ['biology', 'bio'],
    'english': ['english', 'eng'],
    'history': ['history', 'hist'],
    'geography': ['geography', 'geo'],
  };

  // Check against available subjects first
  for (const subject of availableSubjects) {
    const normalizedSubject = normalizeText(subject);
    if (normalized.includes(normalizedSubject)) {
      return subject;
    }
  }

  // Check against keyword map
  for (const [subject, keywords] of Object.entries(subjectKeywords)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        return subject;
      }
    }
  }

  return null;
};

/**
 * Parses navigation commands
 */
const parseNavigationCommand = (text: string, availableSubjects: string[] = []): Command | null => {
  const normalized = normalizeText(text);
  
  // "Go to dashboard" / "Show dashboard" / "Open dashboard"
  if (normalized.match(/\b(go to|show|open|navigate to)\s+dashboard\b/)) {
    return {
      type: 'navigate',
      action: 'dashboard',
      confidence: 0.9,
      rawTranscript: text,
    };
  }

  // "Go to home" / "Go home"
  if (normalized.match(/\b(go to|go)\s+home\b/)) {
    return {
      type: 'navigate',
      action: 'home',
      confidence: 0.9,
      rawTranscript: text,
    };
  }

  // "Go to setup" / "Open setup"
  if (normalized.match(/\b(go to|open|navigate to)\s+setup\b/)) {
    return {
      type: 'navigate',
      action: 'setup',
      confidence: 0.9,
      rawTranscript: text,
    };
  }

  // "Open [subject] chapter [number]" / "Start [subject] chapter [number]"
  const chapterMatch = normalized.match(/\b(open|start|go to|navigate to)\s+([a-z\s]+)?\s*chapter\s+(\d+)\b/);
  if (chapterMatch) {
    const subject = extractSubject(text, availableSubjects);
    const chapterNumber = extractNumber(text);
    
    return {
      type: 'navigate',
      action: 'chapter',
      params: {
        subject: subject || undefined,
        chapterNumber: chapterNumber || undefined,
      },
      confidence: 0.85,
      rawTranscript: text,
    };
  }

  // "Start [subject] chapter [number] lesson" / "Open lesson [number]"
  const lessonMatch = normalized.match(/\b(start|open|go to)\s+([a-z\s]+)?\s*chapter\s+(\d+)\s+lesson\b/);
  if (lessonMatch) {
    const subject = extractSubject(text, availableSubjects);
    const chapterNumber = extractNumber(text);
    
    return {
      type: 'navigate',
      action: 'lesson',
      params: {
        subject: subject || undefined,
        chapterNumber: chapterNumber || undefined,
      },
      confidence: 0.85,
      rawTranscript: text,
    };
  }

  // "Class [number] [subject] chapter [number]" (e.g., "class 11 physics chapter 1")
  const classChapterMatch = normalized.match(/\bclass\s+(\d+)\s+([a-z\s]+)\s+chapter\s+(\d+)\b/);
  if (classChapterMatch) {
    const subject = extractSubject(text, availableSubjects);
    const chapterNumber = extractNumber(text);
    
    return {
      type: 'navigate',
      action: 'chapter',
      params: {
        subject: subject || undefined,
        chapterNumber: chapterNumber || undefined,
      },
      confidence: 0.8,
      rawTranscript: text,
    };
  }

  return null;
};

/**
 * Parses lesson control commands
 */
const parseLessonControlCommand = (text: string): Command | null => {
  const normalized = normalizeText(text);
  
  // Play commands
  if (normalized.match(/\b(play|start|begin)\s*(lesson|narrating|narration)?\b/)) {
    return {
      type: 'lesson_control',
      action: 'play',
      confidence: 0.9,
      rawTranscript: text,
    };
  }

  // Pause commands
  if (normalized.match(/\bpause\b/)) {
    return {
      type: 'lesson_control',
      action: 'pause',
      confidence: 0.95,
      rawTranscript: text,
    };
  }

  // Resume commands
  if (normalized.match(/\b(resume|continue|unpause)\b/)) {
    return {
      type: 'lesson_control',
      action: 'resume',
      confidence: 0.9,
      rawTranscript: text,
    };
  }

  // Stop commands
  if (normalized.match(/\bstop\b/)) {
    return {
      type: 'lesson_control',
      action: 'stop',
      confidence: 0.95,
      rawTranscript: text,
    };
  }

  // Next lesson
  if (normalized.match(/\b(next|forward)\s*(lesson|section)?\b/)) {
    return {
      type: 'lesson_control',
      action: 'next',
      confidence: 0.9,
      rawTranscript: text,
    };
  }

  // Previous lesson
  if (normalized.match(/\b(previous|back|go back)\s*(lesson|section)?\b/)) {
    return {
      type: 'lesson_control',
      action: 'previous',
      confidence: 0.9,
      rawTranscript: text,
    };
  }

  return null;
};

/**
 * Parses discovery commands
 */
const parseDiscoveryCommand = (text: string): Command | null => {
  const normalized = normalizeText(text);
  
  // List chapters
  if (normalized.match(/\b(what|list|show)\s*(chapters|chapter)\s*(do i have|are available|are there)?\b/)) {
    return {
      type: 'discovery',
      action: 'list_chapters',
      confidence: 0.85,
      rawTranscript: text,
    };
  }

  // List subjects
  if (normalized.match(/\b(what|list|show)\s*(subjects|subject)\s*(do i have|are available)?\b/)) {
    return {
      type: 'discovery',
      action: 'list_subjects',
      confidence: 0.85,
      rawTranscript: text,
    };
  }

  // Current lesson
  if (normalized.match(/\b(what|which|where)\s*(lesson|section)\s*(am i on|am i at|is this)?\b/)) {
    return {
      type: 'discovery',
      action: 'current_lesson',
      confidence: 0.85,
      rawTranscript: text,
    };
  }

  // Help
  if (normalized.match(/\b(help|what can i say|commands|what do you do)\b/)) {
    return {
      type: 'discovery',
      action: 'help',
      confidence: 0.9,
      rawTranscript: text,
    };
  }

  return null;
};

/**
 * Main command parser
 */
export const parseVoiceCommand = (
  transcript: string,
  availableSubjects: string[] = []
): Command => {
  // Try navigation commands first (most specific)
  const navCommand = parseNavigationCommand(transcript, availableSubjects);
  if (navCommand) return navCommand;

  // Try lesson control commands
  const lessonCommand = parseLessonControlCommand(transcript);
  if (lessonCommand) return lessonCommand;

  // Try discovery commands
  const discoveryCommand = parseDiscoveryCommand(transcript);
  if (discoveryCommand) return discoveryCommand;

  // Unknown command
  return {
    type: 'unknown',
    confidence: 0,
    rawTranscript: transcript,
  };
};

/**
 * Gets help text for available commands
 */
export const getHelpText = (): string => {
  return `Here are the commands you can use:

Navigation:
- "Go to dashboard" - Navigate to your dashboard
- "Open physics chapter 1" - Open a specific chapter
- "Start class 11 physics chapter 1 lesson" - Open and start a lesson

Lesson Control:
- "Play lesson" or "Start narrating" - Begin lesson narration
- "Pause" - Pause narration
- "Resume" or "Continue" - Resume narration
- "Stop" - Stop narration
- "Next lesson" - Go to next lesson
- "Previous lesson" - Go to previous lesson

Discovery:
- "What chapters do I have?" - List your available chapters
- "List my subjects" - List your subjects
- "What lesson am I on?" - Announce current lesson
- "Help" - Show this help message`;
};
