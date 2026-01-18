import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import ChapterReviewPage from './pages/ChapterReviewPage';
import ParseResultPage from './pages/ParseResultPage';
import UserSetupPage from './pages/UserSetupPage';
import { LessonPage } from './pages/LessonPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import AdminUploadPage from './pages/AdminUploadPage';
import AdminChapterReviewPage from './pages/AdminChapterReviewPage';
import { VoiceAgentProvider } from './components/VoiceAgentProvider';
import { VoiceAgentControls } from './components/VoiceAgentControls';

function App() {
  return (
    <Router>
      <VoiceAgentProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/parse" element={<UploadPage />} />
          <Route path="/parse/review" element={<ChapterReviewPage />} />
          <Route path="/parse/result" element={<ParseResultPage />} />
          <Route 
            path="/setup" 
            element={
              <ProtectedRoute>
                <UserSetupPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requireSetup={true}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/:classId/:subjectId/:unit" 
            element={<LessonPage />} 
          />
          {/* Admin Routes */}
          <Route path="/admin/upload" element={<AdminUploadPage />} />
          <Route path="/admin/review" element={<AdminChapterReviewPage />} />
        </Routes>
        <VoiceAgentControls />
      </VoiceAgentProvider>
    </Router>
  );
}

export default App;
