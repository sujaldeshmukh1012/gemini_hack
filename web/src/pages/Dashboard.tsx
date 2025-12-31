import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface AccessibilitySettings {
  voiceNarration: boolean;
  captions: boolean;
  textSize: 'normal' | 'large' | 'xlarge';
  contrastMode: boolean;
}

function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    voiceNarration: false,
    captions: true,
    textSize: 'normal',
    contrastMode: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user
    fetch('http://localhost:8000/api/auth/me', {
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Not authenticated');
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    fetch('http://localhost:8000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then(() => {
        navigate('/login');
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl text-gray-700 font-semibold">Loading...</div>
      </div>
    );
  }

  const textSizeClass = {
    normal: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl',
  }[accessibility.textSize];

  return (
    <div className={`min-h-screen ${accessibility.contrastMode ? 'bg-black text-white' : 'bg-linear-to-br from-blue-50 to-purple-50'} ${textSizeClass}`}>
      {/* Top Bar */}
      <div className={`${accessibility.contrastMode ? 'bg-gray-900 border-gray-700' : 'bg-white/80 backdrop-blur-sm border-gray-200'} border-b sticky top-0 z-50`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Greeting */}
            <div className="flex items-center gap-4">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                👋 Hi, {user?.name?.split(' ')[0] || 'Friend'}!
              </div>
            </div>

            {/* Accessibility Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAccessibility(!showAccessibility)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all shadow-lg ${
                  accessibility.contrastMode
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-linear-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl'
                }`}
              >
                🎧 Accessibility
              </button>
              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  accessibility.contrastMode
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } shadow-lg`}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Accessibility Settings Panel */}
          {showAccessibility && (
            <div className={`mt-4 p-4 rounded-2xl ${accessibility.contrastMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setAccessibility({ ...accessibility, voiceNarration: !accessibility.voiceNarration })}
                  className={`p-4 rounded-xl text-left transition-all ${
                    accessibility.voiceNarration
                      ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white'
                      : accessibility.contrastMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">🔊</div>
                  <div className="font-semibold">Voice Narration</div>
                  <div className="text-sm opacity-80">{accessibility.voiceNarration ? 'ON' : 'OFF'}</div>
                </button>

                <button
                  onClick={() => setAccessibility({ ...accessibility, captions: !accessibility.captions })}
                  className={`p-4 rounded-xl text-left transition-all ${
                    accessibility.captions
                      ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white'
                      : accessibility.contrastMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">💬</div>
                  <div className="font-semibold">Captions</div>
                  <div className="text-sm opacity-80">{accessibility.captions ? 'ON' : 'OFF'}</div>
                </button>

                <div className={`p-4 rounded-xl ${accessibility.contrastMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="text-2xl mb-2">📏</div>
                  <div className="font-semibold mb-2">Text Size</div>
                  <div className="flex gap-2">
                    {(['normal', 'large', 'xlarge'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setAccessibility({ ...accessibility, textSize: size })}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          accessibility.textSize === size
                            ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white'
                            : accessibility.contrastMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-700'
                        }`}
                      >
                        {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setAccessibility({ ...accessibility, contrastMode: !accessibility.contrastMode })}
                  className={`p-4 rounded-xl text-left transition-all ${
                    accessibility.contrastMode
                      ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">◐</div>
                  <div className="font-semibold">High Contrast</div>
                  <div className="text-sm opacity-80">{accessibility.contrastMode ? 'ON' : 'OFF'}</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <StudentView accessibility={accessibility} />
      </div>

      {/* Floating Ask Button */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-110 flex items-center justify-center text-2xl z-50">
        💬
      </button>
    </div>
  );
}

function StudentView({ accessibility }: { accessibility: AccessibilitySettings }) {
  const [showAskModal, setShowAskModal] = useState(false);

  return (
    <div className="space-y-8">
      {/* Today's Focus */}
      <div className={`${accessibility.contrastMode ? 'bg-gray-900' : 'bg-white'} rounded-3xl p-8 shadow-2xl`}>
        <div className="mb-4">
          <div className="text-sm font-semibold text-purple-600 mb-2">🎯 TODAY'S FOCUS</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Fractions using Pizza 🍕
          </h2>
          <p className={`text-xl ${accessibility.contrastMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
            Based on how you learn best
          </p>
          <div className="flex items-center gap-2 text-lg text-gray-500">
            <span>⏱</span>
            <span>Learn at your pace</span>
          </div>
        </div>

        <button className="w-full md:w-auto px-12 py-6 bg-linear-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 flex items-center justify-center gap-3">
          <span>Start Lesson</span>
          <span className="text-3xl">▶</span>
        </button>
      </div>

      {/* Learning Journey */}
      <div className={`${accessibility.contrastMode ? 'bg-gray-900' : 'bg-white'} rounded-3xl p-8 shadow-2xl`}>
        <div className="mb-6">
          <div className="text-sm font-semibold text-purple-600 mb-2">📈 YOUR LEARNING JOURNEY</div>
          <h3 className="text-2xl md:text-3xl font-bold">Your Path</h3>
        </div>

        {/* Visual Roadmap */}
        <div className="space-y-6">
          {/* Completed Node */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-3xl shadow-lg shadow-green-500/50 animate-pulse">
              ✔
            </div>
            <div className="flex-1">
              <div className="text-xl md:text-2xl font-bold">Numbers</div>
              <div className={`${accessibility.contrastMode ? 'text-gray-400' : 'text-gray-600'}`}>
                You understood this well! 🌟
              </div>
            </div>
          </div>

          {/* Line connector */}
          <div className="ml-10 border-l-4 border-dashed border-purple-300 h-8"></div>

          {/* Current Node */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-lg shadow-yellow-500/50 relative">
              🍕
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold animate-bounce">
                ●
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xl md:text-2xl font-bold">Fractions</div>
              <div className={`${accessibility.contrastMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                You're getting better at this! Keep going 💪
              </div>
              {/* Confidence meter */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-linear-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
                </div>
                <div className="text-sm font-semibold text-orange-500">Building Confidence</div>
              </div>
            </div>
          </div>

          {/* Line connector */}
          <div className="ml-10 border-l-4 border-dashed border-gray-300 h-8"></div>

          {/* Locked Node */}
          <div className="flex items-center gap-6 opacity-50">
            <div className={`w-20 h-20 ${accessibility.contrastMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full flex items-center justify-center text-3xl shadow-lg`}>
              🔒
            </div>
            <div className="flex-1">
              <div className="text-xl md:text-2xl font-bold">Decimals</div>
              <div className={`${accessibility.contrastMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Coming soon!
              </div>
            </div>
          </div>

          {/* Line connector */}
          <div className="ml-10 border-l-4 border-dashed border-gray-300 h-8"></div>

          {/* Future Node */}
          <div className="flex items-center gap-6 opacity-50">
            <div className={`w-20 h-20 ${accessibility.contrastMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full flex items-center justify-center text-3xl shadow-lg`}>
              💰
            </div>
            <div className="flex-1">
              <div className="text-xl md:text-2xl font-bold">Money</div>
              <div className={`${accessibility.contrastMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Coming soon!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Need Help Section */}
      <div className={`${accessibility.contrastMode ? 'bg-gray-900' : 'bg-linear-to-br from-blue-100 to-purple-100'} rounded-3xl p-8 shadow-2xl`}>
        <div className="mb-6">
          <div className="text-sm font-semibold text-purple-600 mb-2">🧠 NEED HELP?</div>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Ask LearnLens AI</h3>
          <p className={`${accessibility.contrastMode ? 'text-gray-400' : 'text-gray-700'} text-lg`}>
            I'm here to help you learn in your own way
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowAskModal(true)}
            className={`p-6 rounded-2xl transition-all hover:scale-105 shadow-lg ${
              accessibility.contrastMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:shadow-xl'
            }`}
          >
            <div className="text-3xl mb-3">🗣</div>
            <div className="font-semibold text-lg">Explain this differently</div>
          </button>

          <button
            onClick={() => setShowAskModal(true)}
            className={`p-6 rounded-2xl transition-all hover:scale-105 shadow-lg ${
              accessibility.contrastMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:shadow-xl'
            }`}
          >
            <div className="text-3xl mb-3">📸</div>
            <div className="font-semibold text-lg">Show me with pictures</div>
          </button>

          <button
            onClick={() => setShowAskModal(true)}
            className={`p-6 rounded-2xl transition-all hover:scale-105 shadow-lg ${
              accessibility.contrastMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:shadow-xl'
            }`}
          >
            <div className="text-3xl mb-3">🔊</div>
            <div className="font-semibold text-lg">Read this aloud</div>
          </button>
        </div>
      </div>

      {/* Ask Modal */}
      {showAskModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${accessibility.contrastMode ? 'bg-gray-900' : 'bg-white'} rounded-3xl p-8 max-w-2xl w-full shadow-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold">Ask LearnLens 💬</h3>
              <button
                onClick={() => setShowAskModal(false)}
                className={`text-3xl ${accessibility.contrastMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}
              >
                ×
              </button>
            </div>
            <textarea
              placeholder="Type your question here..."
              className={`w-full h-40 p-4 rounded-2xl border-2 focus:outline-none focus:border-purple-500 text-lg ${
                accessibility.contrastMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
              }`}
            />
            <button className="w-full mt-4 px-8 py-4 bg-linear-to-r from-blue-500 to-purple-500 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              Send Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
