import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MyCoursesPage } from './pages/MyCoursesPage';
import { CourseDetailsPage } from './pages/CourseDetailsPage';
import { CourseGenerationPage } from './pages/CourseGenerationPage';
import { LearningWorkspacePage } from './pages/LearningWorkspacePage';
import { QuizPage } from './pages/QuizPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { NotesPage } from './pages/NotesPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isWorkspace = location.pathname.startsWith('/workspace');

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FFD21C] selection:text-[#101014]">
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<MyCoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
            <Route path="/generate" element={<CourseGenerationPage />} />
            <Route path="/workspace/:courseId" element={<LearningWorkspacePage />} />
            <Route path="/quizzes" element={<QuizPage />} />
            <Route path="/study-plan" element={<StudyPlannerPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
      </div>
      {!isWorkspace ? (
        <Footer />
      ) : (
        <div className="arcade-ribbon mt-6"></div>
      )}
    </div>
  );
};

export function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
