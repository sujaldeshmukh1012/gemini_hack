export interface CoreConcept {
  conceptTitle: string;
  explanation: string;
  example: string;
  diagramDescription: string;
}

export interface QuickCheckQuestion {
  question: string;
  answer: string;
}

export interface LessonContent {
  introduction: string;
  coreConcepts: CoreConcept[];
  summary: string[];
  quickCheckQuestions: QuickCheckQuestion[];
}

export interface Lesson { 
  sectionId: string;
  title: string;
  lessonContent: LessonContent;
}

export interface UnitLessons {
  unitTitle: string;
  unitDescription: string;
  lessons: Lesson[];
}