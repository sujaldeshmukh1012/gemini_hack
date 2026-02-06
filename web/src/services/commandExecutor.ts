/**
 * Command Executor Service
 * Handles execution of all voice commands/tool calls from Gemini
 */
import type { SubjectWithChapters, StructuredChapter } from '../types';
import { apiUrl } from '../utils/api';
import type { To } from 'react-router-dom';
import type { SupportedLanguage } from '../utils/language';
import { saveLanguagePreference } from '../utils/language';
import { loadAccessibilityPreferences, saveAccessibilityPreferences } from '../utils/accessibility';

export interface CommandExecutorDependencies {
  navigate: (to: To, options?: any) => void;
  user: any;
  availableSubjects: SubjectWithChapters[];
}

export class CommandExecutor {
  private deps: CommandExecutorDependencies;

  constructor(dependencies: CommandExecutorDependencies) {
    this.deps = dependencies;
    this.logDependencies();
  }

  /**
   * Debug: Log current dependencies state
   */
  private logDependencies() {
    // console.log('[CommandExecutor] Dependencies updated:', {
    //   hasNavigate: !!this.deps.navigate,
    //   hasUser: !!this.deps.user,
    //   subjectsCount: this.deps.availableSubjects.length
    // });
  }

  /**
   * Execute a tool call from Gemini
   */
  async executeToolCall(toolCall: any): Promise<any[]> {

    const calls = toolCall.functionCalls || [];
    const responses: any[] = [];

    for (const call of calls) {

      try {
        let success = false;
        let result: any = {};

        switch (call.name) {
          case 'navigate':
            success = await this.navigate(call.args.destination);
            result = { success, destination: call.args.destination };
            break;

          case 'openLesson':
            success = await this.openLesson(call.args.subject, call.args.chapterNumber, call.args.lessonNumber, call.args.contentType);
            result = { success, subject: call.args.subject, chapterNumber: call.args.chapterNumber, lessonNumber: call.args.lessonNumber, contentType: call.args.contentType };
            break;

          case 'openChapter':
            success = await this.openChapter(call.args.subject, call.args.chapterNumber);
            result = { success, subject: call.args.subject, chapterNumber: call.args.chapterNumber };
            break;

          case 'lessonControl':
            success = this.lessonControl(call.args.action);
            result = { success, action: call.args.action };
            break;

          case 'listSubjects':
            result = await this.listSubjects();
            success = true;
            break;

          case 'listChapters':
            result = await this.listChapters(call.args.subject);
            success = true;
            break;

          case 'convertBraille':
            success = this.convertBraille();
            result = { success };
            break;

          case 'toggleFocusMode':
            success = this.toggleFocusMode(call.args.enabled);
            result = { success, enabled: call.args.enabled };
            break;

          case 'openStoryMode':
            success = this.openStoryMode();
            result = { success };
            break;

          case 'openBraille':
            success = this.openBraille();
            result = { success };
            break;

          case 'setLanguage':
            success = await this.setLanguage(call.args.language);
            result = { success, language: call.args.language };
            break;

          case 'toggleLargeText':
            success = this.toggleAccessibility('largeText');
            result = { success };
            break;

          case 'toggleCaptions':
            success = this.toggleAccessibility('captionsOn');
            result = { success };
            break;

          case 'toggleSigns':
            success = this.toggleAccessibility('signsOn');
            result = { success };
            break;

          case 'toggleReduceMotion':
            success = this.toggleAccessibility('reduceMotion');
            result = { success };
            break;

          case 'quizSelectOption':
            success = this.quizSelectOption(call.args.questionNumber, call.args.option, call.args.optionText);
            result = { success, questionNumber: call.args.questionNumber, option: call.args.option, optionText: call.args.optionText };
            break;

          case 'quizSubmit':
            success = this.quizSubmit();
            result = { success };
            break;

          case 'scrollPage':
            success = this.scrollPage(call.args.direction, call.args.amountPx);
            result = { success, direction: call.args.direction, amountPx: call.args.amountPx };
            break;

          case 'navigateHistory':
            success = this.navigateHistory(call.args.delta);
            result = { success, delta: call.args.delta };
            break;

          default:
            console.warn('[CommandExecutor] Unknown tool:', call.name);
            result = { success: false, error: 'Unknown tool' };
        }

        responses.push({
          id: call.id,
          name: call.name,
          response: result
        });

      } catch (error: any) {
        console.error('[CommandExecutor] Error executing tool:', call.name, error);
        responses.push({
          id: call.id,
          name: call.name,
          response: { success: false, error: error.message }
        });
      }
    }

    return responses;
  }

  /**
   * Execute a JSON "command" object (fallback when model returns text instead of tool calls).
   */
  async executeCommand(command: any): Promise<boolean> {
    if (!command || typeof command !== 'object') return false;

    const type = String(command.type || '');
    const action = command.action !== undefined ? String(command.action) : undefined;
    const params = (command.params && typeof command.params === 'object') ? command.params : {};

    try {
      switch (type) {
        case 'navigate': {
          if (!action) return false;
          if (action === 'chapter' || action === 'lesson') {
            const subject = params.subject;
            const chapterNumber = params.chapterNumber;
            const lessonNumber = params.lessonNumber;

            if (typeof chapterNumber !== 'number') return false;
            if (action === 'chapter') {
              return await this.openChapter(typeof subject === 'string' ? subject : undefined, chapterNumber);
            }

            const ok = await this.openLesson(typeof subject === 'string' ? subject : undefined, chapterNumber, lessonNumber, params.contentType);
            if (ok) this.lessonControl('play');
            return ok;
          }

          return await this.navigate(action);
        }

        case 'lesson_control': {
          if (!action) return false;
          return this.lessonControl(action);
        }

        case 'discovery': {
          if (!action) return false;
          if (action === 'list_subjects') {
            await this.listSubjects();
            return true;
          }
          if (action === 'list_chapters') {
            await this.listChapters(params.subject);
            return true;
          }
          return true;
        }

        default:
          return false;
      }
    } catch (e) {
      console.warn('[CommandExecutor] executeCommand failed:', e);
      return false;
    }
  }

  private findSubject(subjectName?: string): SubjectWithChapters | null {
    const subjects = this.deps.availableSubjects || [];

    const normalize = (s: string) => s.toLowerCase().trim();

    if (subjectName && typeof subjectName === 'string' && subjectName.trim()) {
      const needle = normalize(subjectName);
      const bySlug = subjects.find((s) => normalize(s.slug) === needle);
      if (bySlug) return bySlug;

      const byName = subjects.find((s) => normalize(s.name).includes(needle) || needle.includes(normalize(s.name)));
      if (byName) return byName;
    }

    // Infer subject from the current route: /:classId/:subjectId/:chapterSlug/...
    try {
      const segments = window.location.pathname.split('/').filter(Boolean);
      const subjectSlugFromPath = segments[1];
      if (subjectSlugFromPath) {
        const bySlug = subjects.find((s) => normalize(s.slug) === normalize(subjectSlugFromPath));
        if (bySlug) return bySlug;
      }
    } catch {
      // ignore
    }

    if (subjects.length === 1) return subjects[0];
    return null;
  }

  private getChapterByNumber(subject: SubjectWithChapters, chapterNumber: number) {
    const sortedChapters = [...subject.chapters].sort((a, b) =>
      (a.sortOrder || 0) - (b.sortOrder || 0)
    );
    return sortedChapters[chapterNumber - 1] || null;
  }

  private toggleFocusMode(enabled?: boolean): boolean {
    try {
      const event = new CustomEvent('focus-mode-toggle', { detail: { value: enabled } });
      window.dispatchEvent(event);
      return true;
    } catch (error) {
      console.error('[CommandExecutor] Failed to toggle focus mode:', error);
      return false;
    }
  }

  private openStoryMode(): boolean {
    try {
      const event = new CustomEvent('story-open');
      window.dispatchEvent(event);
      return true;
    } catch (error) {
      console.error('[CommandExecutor] Failed to open story mode:', error);
      return false;
    }
  }

  private openBraille(): boolean {
    try {
      const event = new CustomEvent('braille-open');
      window.dispatchEvent(event);
      return true;
    } catch (error) {
      console.error('[CommandExecutor] Failed to open braille:', error);
      return false;
    }
  }

  private toggleAccessibility(key: 'largeText' | 'captionsOn' | 'signsOn' | 'reduceMotion'): boolean {
    try {
      const current = loadAccessibilityPreferences();
      const next = { ...current, [key]: !current[key] };
      saveAccessibilityPreferences(next);
      return true;
    } catch (error) {
      console.error('[CommandExecutor] Failed to toggle accessibility setting:', key, error);
      return false;
    }
  }

  private async setLanguage(language: string): Promise<boolean> {
    const normalized = String(language || '').toLowerCase().trim();
    if (normalized !== 'en' && normalized !== 'es' && normalized !== 'hi') {
      return false;
    }

    const next = normalized as SupportedLanguage;
    saveLanguagePreference(next);

    if (this.deps.user) {
      try {
        await fetch(apiUrl('/api/auth/preferences'), {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: next })
        });
      } catch (error) {
        console.warn('[CommandExecutor] Failed to persist language preference', error);
      }
    }

    return true;
  }

  private quizSelectOption(questionNumber?: number, option?: string, optionText?: string): boolean {
    try {
      const event = new CustomEvent('quiz-control', {
        detail: {
          action: 'select',
          questionNumber,
          option,
          optionText,
        }
      });
      window.dispatchEvent(event);
      return true;
    } catch (error) {
      console.error('[CommandExecutor] Failed to select quiz option:', error);
      return false;
    }
  }

  private quizSubmit(): boolean {
    try {
      const event = new CustomEvent('quiz-control', { detail: { action: 'submit' } });
      window.dispatchEvent(event);
      return true;
    } catch (error) {
      console.error('[CommandExecutor] Failed to submit quiz:', error);
      return false;
    }
  }

  private scrollPage(direction: string, amountPx?: number): boolean {
    try {
      const normalized = String(direction || '').toLowerCase();
      const amount = typeof amountPx === 'number' && Number.isFinite(amountPx) ? amountPx : 400;

      if (normalized === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return true;
      }
      if (normalized === 'bottom') {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        return true;
      }
      if (normalized === 'up') {
        window.scrollBy({ top: -amount, behavior: 'smooth' });
        return true;
      }
      if (normalized === 'down') {
        window.scrollBy({ top: amount, behavior: 'smooth' });
        return true;
      }

      return false;
    } catch (error) {
      console.error('[CommandExecutor] Failed to scroll page:', error);
      return false;
    }
  }

  private navigateHistory(delta: number): boolean {
    try {
      if (typeof delta !== 'number' || !Number.isFinite(delta)) return false;
      window.history.go(delta);
      return true;
    } catch (error) {
      console.error('[CommandExecutor] Failed to navigate history:', error);
      return false;
    }
  }

  /**
   * Navigate to a page in the app
   */
  private async navigate(destination: string): Promise<boolean> {
    try {
      const routes: Record<string, string> = {
        dashboard: '/dashboard',
        home: '/',
        setup: '/setup',
        'accessibility-guide': '/accessibility-guide',
      };

      const normalizedDestination = destination?.toLowerCase().replace(/\s+/g, '-');
      const route = routes[destination] || routes[normalizedDestination];
      if (route) {
        this.deps.navigate(route);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[CommandExecutor] Navigation error:', error);
      return false;
    }
  }

  /**
   * Open a specific lesson by subject and chapter number
   */
  private async openLesson(subjectName: string | undefined, chapterNumber: number, lessonNumber?: number, contentType?: string): Promise<boolean> {
    try {
      if (!this.deps.user?.profile?.classId) {
        console.error('[CommandExecutor] No user profile');
        return false;
      }

      const classId = this.deps.user.profile.classId;

      const subject = this.findSubject(subjectName);

      if (!subject) {
        console.error('[CommandExecutor] Subject not found:', subjectName);
        return false;
      }

      const chapter = this.getChapterByNumber(subject, chapterNumber);

      if (!chapter) {
        console.error('[CommandExecutor] Chapter not found at index:', chapterNumber - 1);
        return false;
      }

      // Try to deep link to the first microsection
      try {
        const response = await fetch(
          apiUrl(`/api/lessons/structured/${classId}/${subject.slug}/${chapter.slug}`)
        );

        if (response.ok) {
          const chapterData: StructuredChapter = await response.json();

          let targetSection;

          if (lessonNumber) {
            // Try to find specific section by index (1-based)
            if (lessonNumber > 0 && lessonNumber <= chapterData.sections.length) {
              targetSection = chapterData.sections[lessonNumber - 1];
            } else {
              console.warn('[CommandExecutor] Lesson number out of bounds:', lessonNumber);
            }
          }

          // Fallback to first section with content if no specific lesson requested or not found
          if (!targetSection) {
            targetSection = chapterData.sections.find(s => s.microsections.length > 0);
          }

          if (targetSection) {
            let targetMicrosection;

            // Filter by content type if requested (e.g., 'video', 'quiz')
            if (contentType) {
              const type = contentType.toLowerCase();
              targetMicrosection = targetSection.microsections.find(m => m.type === type);
            }

            // Fallback to first microsection if type not found or not specified
            if (!targetMicrosection) {
              targetMicrosection = targetSection.microsections[0];
            }

            if (targetMicrosection) {
              const route = `/${classId}/${subject.slug}/${chapter.slug}/${targetSection.slug}/${targetMicrosection.id}`;
              console.log('[CommandExecutor] Deep linking to:', route);
              this.deps.navigate(route);
              return true;
            }
          }
        }
      } catch (e) {
        console.warn('Failed to fetch chapter details for deep linking', e);
      }

      // Fallback to chapter page
      const route = `/${classId}/${subject.slug}/${chapter.slug}`;
      this.deps.navigate(route);

      return true;
    } catch (error) {
      console.error('[CommandExecutor] Open lesson error:', error);
      return false;
    }
  }

  /**
   * Open a specific chapter (chapter overview page) by subject and chapter number
   */
  private async openChapter(subjectName: string | undefined, chapterNumber: number): Promise<boolean> {
    try {
      if (!this.deps.user?.profile?.classId) {
        console.error('[CommandExecutor] No user profile');
        return false;
      }

      const classId = this.deps.user.profile.classId;
      const subject = this.findSubject(subjectName);

      if (!subject) {
        console.error('[CommandExecutor] Subject not found:', subjectName);
        return false;
      }

      const chapter = this.getChapterByNumber(subject, chapterNumber);
      if (!chapter) {
        console.error('[CommandExecutor] Chapter not found at index:', chapterNumber - 1);
        return false;
      }

      const route = `/${classId}/${subject.slug}/${chapter.slug}`;
      this.deps.navigate(route);
      return true;
    } catch (error) {
      console.error('[CommandExecutor] Open chapter error:', error);
      return false;
    }
  }

  /**
   * Control lesson playback via voice commands
   */
  private lessonControl(action: string): boolean {

    try {
      // Dispatch custom event that LessonViewer listens for
      const event = new CustomEvent('lesson-control', {
        detail: { action }
      });
      window.dispatchEvent(event);
      return true;
    } catch (error) {
      console.error('[CommandExecutor] Failed to dispatch event:', error);
      return false;
    }
  }

  /**
   * Convert content to Braille via voice command
   */
  private convertBraille(): boolean {
    try {
      const event = new CustomEvent('braille-control', {
        detail: { action: 'convert' }
      });
      window.dispatchEvent(event);
      return true;
    } catch (error) {
      console.error('[CommandExecutor] Failed to dispatch braille event:', error);
      return false;
    }
  }

  /**
   * List available subjects
   */
  private async listSubjects(): Promise<any> {
    try {

      if (this.deps.availableSubjects.length === 0) {
        console.warn('[CommandExecutor] No subjects loaded!');
        return {
          subjects: [],
          error: 'No subjects available. Please log in and complete setup.'
        };
      }

      const subjectNames = this.deps.availableSubjects.map(s => s.name);
      return { subjects: subjectNames };
    } catch (error) {
      console.error('[CommandExecutor] List subjects error:', error);
      return { subjects: [], error: 'Failed to load subjects' };
    }
  }

  /**
   * List available chapters
   */
  private async listChapters(subjectName?: string): Promise<any> {
    try {

      if (this.deps.availableSubjects.length === 0) {
        console.warn('[CommandExecutor] No subjects loaded!');
        return {
          chapters: [],
          error: 'No subjects available. Please log in and complete setup.'
        };
      }

      if (subjectName) {

        const subject = this.deps.availableSubjects.find(s =>
          s.name.toLowerCase().includes(subjectName.toLowerCase())
        );

        if (subject) {
          if (subject.chapters.length === 0) {
            console.warn('[CommandExecutor] Subject has no chapters!');
            return {
              chapters: [],
              subject: subject.name,
              error: `${subject.name} has no chapters yet`
            };
          }

          const chapterNames = subject.chapters.map(c => c.name);
          return { chapters: chapterNames, subject: subject.name };
        }

        console.error('[CommandExecutor] Subject not found:', subjectName);
        return {
          chapters: [],
          error: `Subject "${subjectName}" not found. Available: ${this.deps.availableSubjects.map(s => s.name).join(', ')}`
        };
      } else {
        // List all chapters across all subjects
        const allChapters: string[] = [];
        let totalChapters = 0;

        this.deps.availableSubjects.forEach(subject => {
          subject.chapters.forEach(chapter => {
            allChapters.push(`${subject.name}: ${chapter.name}`);
            totalChapters++;
          });
        });

        if (totalChapters === 0) {
          console.warn('[CommandExecutor] ⚠️ No chapters in any subject!');
          return {
            chapters: [],
            error: 'No chapters available. Database may need seeding.'
          };
        }

        return { chapters: allChapters };
      }
    } catch (error) {
      console.error('[CommandExecutor] List chapters error:', error);
      return { chapters: [], error: 'Failed to load chapters' };
    }
  }

  /**
   * Update dependencies (useful when subjects/user change)
   */
  updateDependencies(dependencies: Partial<CommandExecutorDependencies>) {
    this.deps = { ...this.deps, ...dependencies };
    this.logDependencies();
  }
}
