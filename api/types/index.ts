export interface UnitSection {
  sectionId: string;
  title: string;
  description: string;
  learningGoals: string[];
}

export interface Unit {
  unitTitle: string;
  unitDescription: string;
  sections: UnitSection[];
}

// Lesson output types
export interface QuickCheckQuestion {
  question: string;
  answer: string;
}

export interface CoreConcept {
  conceptTitle: string;
  explanation: string;
  example: string;
  diagramDescription: string;
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

// Book is an array of units
export type Book = Unit[];