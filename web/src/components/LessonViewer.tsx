import React from "react";
import { MathText } from "./MathText";
import type { UnitLessons } from "../types";


interface LessonViewerProps {
  book: UnitLessons[];
}

// Using custom MathText that loads MathJax from CDN, no external hooks

const LessonViewerContent: React.FC<{ book: UnitLessons[] }> = ({ book }) => {
  const [selectedUnitIdx, setSelectedUnitIdx] = React.useState(0);
  const [selectedLessonIdx, setSelectedLessonIdx] = React.useState(0);
  const unit = book[selectedUnitIdx];
  const lesson = unit.lessons[selectedLessonIdx];

  return (
      <div style={{ display: "flex", height: "100vh", background: "#f8fafc" }}>
        {/* Sidebar */}
        <div style={{ width: 340, background: "#fff", borderRight: "1px solid #e5e7eb", padding: 24, overflowY: "auto" }}>
          <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{unit.unitTitle}</div>
          <div style={{ color: "#64748b", fontSize: 15, marginBottom: 24 }}>{unit.unitDescription}</div>
          <div>
            {unit.lessons.map((l, idx) => (
              <div
                key={l.sectionId}
                onClick={() => setSelectedLessonIdx(idx)}
                style={{
                  background: idx === selectedLessonIdx ? "#f1f5f9" : undefined,
                  borderRadius: 6,
                  padding: "10px 14px",
                  marginBottom: 6,
                  cursor: "pointer",
                  fontWeight: idx === selectedLessonIdx ? 600 : 400,
                  color: idx === selectedLessonIdx ? "#2563eb" : "#0f172a",
                  borderLeft: idx === selectedLessonIdx ? "3px solid #2563eb" : "3px solid transparent",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                {l.title}
              </div>
            ))}
          </div>
        </div>
        {/* Main Content */}
        <div style={{ flex: 1, padding: 40, overflowY: "auto" }}>
          <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>{lesson.title}</div>
          <div style={{ fontSize: 18, color: "#334155", marginBottom: 24 }}>
            <MathText text={lesson.lessonContent.introduction} />
          </div>
          <div>
            {lesson.lessonContent.coreConcepts.map((concept, i) => (
              <div key={i} style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>{concept.conceptTitle}</div>
                <div style={{ fontSize: 16, color: "#334155", marginBottom: 6 }}>
                  <MathText text={concept.explanation} />
                </div>
                <div style={{ fontSize: 15, color: "#475569", marginBottom: 4 }}>
                  <b>Example:</b> <MathText text={concept.example} />
                </div>
                <div style={{ fontSize: 14, color: "#64748b" }}>
                  <b>Diagram:</b> {concept.diagramDescription}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Summary</div>
            <ul style={{ marginLeft: 20 }}>
              {lesson.lessonContent.summary.map((point, i) => (
                <li key={i} style={{ fontSize: 15, color: "#334155", marginBottom: 2 }}>
                  <MathText text={point} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Quick Check Questions</div>
            <ul style={{ marginLeft: 20 }}>
              {lesson.lessonContent.quickCheckQuestions.map((q, i) => (
                <li key={i} style={{ fontSize: 15, color: "#334155", marginBottom: 8 }}>
                  <b>Q:</b> <MathText text={q.question} />
                  <br />
                  <b>A:</b> <MathText text={q.answer} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
  );
};

export const LessonViewer: React.FC<LessonViewerProps> = ({ book }) => {
  return <LessonViewerContent book={book} />;
};

// Example usage (hardcoded for now):
// import { lessonBookData } from "../data/lessonBookData";
// <LessonViewer book={lessonBookData} />
