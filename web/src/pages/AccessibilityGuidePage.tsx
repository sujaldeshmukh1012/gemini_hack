import { useNavigate } from 'react-router-dom';

const AccessibilityGuidePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-slate-100"
            aria-label="Go back"
          >
            Back
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Accessibility Guide</h1>
            <p className="text-sm text-slate-500">Tools and shortcuts for inclusive learning</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Voice Commands</h2>
          <p className="text-slate-600 mb-4">Use the floating mic button or say the commands below.</p>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>"Open story mode" - start comic-style slides for a topic</li>
            <li>"Open braille" - show braille output for the current topic</li>
            <li>"Enable focus mode" - distraction-free layout</li>
            <li>"Play / pause / resume / stop" - control narration</li>
            <li>"Go to dashboard" - navigation</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">For Visually Impaired Learners</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>Enable Large Text and High Contrast in the Accessibility dock.</li>
            <li>Use Story Mode to get narrated visual explanations with captions.</li>
            <li>Open Braille output on any chapter or article lesson.</li>
            <li>Keyboard: press Tab to move through controls, Enter to activate.</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">For Deaf / Hard of Hearing Learners</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>Captions are always shown in Story Mode.</li>
            <li>Sign language overlays appear when sign assets are available.</li>
            <li>Transcripts are available for video microsections.</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">For ADHD / Focus Support</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>Use Focus Mode to reduce distractions and keep one idea at a time.</li>
            <li>Short story slides help with chunked learning.</li>
            <li>Use the "Play / Pause / Resume" controls for pacing.</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default AccessibilityGuidePage;
