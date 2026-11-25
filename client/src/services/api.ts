import { 
  ICourse, IQuiz, IQuizAttempt, INote, IStudyPlan, IUser, IDashboardStats 
} from '../types';

const API_BASE = '/api';

export const api = {

  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async getCourses(category?: string, search?: string): Promise<ICourse[]> {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/courses?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  },

  async getCourseById(id: string): Promise<ICourse> {
    const res = await fetch(`${API_BASE}/courses/${id}`);
    if (!res.ok) throw new Error('Failed to fetch course');
    return res.json();
  },

  async validateUrl(url: string) {
    const res = await fetch(`${API_BASE}/courses/validate-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Invalid URL');
    }
    return res.json();
  },

  async generateCourse(url: string): Promise<{ success: boolean; course: ICourse; message: string }> {
    const res = await fetch(`${API_BASE}/courses/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to generate course');
    }
    return res.json();
  },

  async deleteCourse(id: string) {
    const res = await fetch(`${API_BASE}/courses/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async getLessonDetails(courseId: string, lessonId: string) {
    const res = await fetch(`${API_BASE}/courses/${courseId}/lessons/${lessonId}`);
    if (!res.ok) throw new Error('Failed to fetch lesson details');
    return res.json();
  },

  async updateLessonProgress(courseId: string, lessonId: string, completed: boolean, timestamp?: number) {
    const res = await fetch(`${API_BASE}/courses/${courseId}/lessons/${lessonId}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed, timestamp })
    });
    return res.json();
  },

  async getQuizzesForCourse(courseId: string): Promise<IQuiz[]> {
    const res = await fetch(`${API_BASE}/quizzes/course/${courseId}`);
    return res.json();
  },

  async getQuizForLesson(lessonId: string): Promise<IQuiz> {
    const res = await fetch(`${API_BASE}/quizzes/lesson/${lessonId}`);
    if (!res.ok) throw new Error('Quiz not found');
    return res.json();
  },

  async submitQuizAttempt(quizId: string, answers: Record<string, any>, courseId?: string, lessonId?: string): Promise<IQuizAttempt> {
    const res = await fetch(`${API_BASE}/quizzes/${quizId}/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, courseId, lessonId })
    });
    if (!res.ok) throw new Error('Failed to submit quiz attempt');
    return res.json();
  },

  async getQuizAttempts(courseId?: string): Promise<IQuizAttempt[]> {
    const url = courseId ? `${API_BASE}/quizzes/attempts?courseId=${courseId}` : `${API_BASE}/quizzes/attempts`;
    const res = await fetch(url);
    return res.json();
  },

  async getNotes(courseId?: string, search?: string): Promise<INote[]> {
    const params = new URLSearchParams();
    if (courseId) params.append('courseId', courseId);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/notes?${params.toString()}`);
    return res.json();
  },

  async createNote(noteData: {
    courseId: string;
    lessonId: string;
    title?: string;
    content: string;
    timestamp: number;
    tags?: string[];
  }): Promise<INote> {
    const res = await fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    if (!res.ok) throw new Error('Failed to create note');
    return res.json();
  },

  async updateNote(id: string, noteData: Partial<INote>): Promise<INote> {
    const res = await fetch(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    return res.json();
  },

  async deleteNote(id: string) {
    const res = await fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async toggleBookmarkNote(id: string): Promise<INote> {
    const res = await fetch(`${API_BASE}/notes/${id}/bookmark`, { method: 'POST' });
    return res.json();
  },

  async getStudyPlan(): Promise<IStudyPlan> {
    const res = await fetch(`${API_BASE}/study-plan`);
    return res.json();
  },

  async updateStudyPlan(planData: {
    dailyStudyHours: number;
    targetCompletionDate: string;
    schedulePreference: string;
    courseId?: string;
  }): Promise<IStudyPlan> {
    const res = await fetch(`${API_BASE}/study-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planData)
    });
    return res.json();
  },

  async toggleStudyTask(taskId: string, completed: boolean): Promise<IStudyPlan> {
    const res = await fetch(`${API_BASE}/study-plan/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });
    return res.json();
  },

  async getDashboard(): Promise<IDashboardStats> {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error('Failed to load dashboard');
    return res.json();
  },

  async getUser(): Promise<IUser> {
    const res = await fetch(`${API_BASE}/user`);
    return res.json();
  },

  async updateUser(data: Partial<IUser>): Promise<IUser> {
    const res = await fetch(`${API_BASE}/user`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getAiSettings() {
    const res = await fetch(`${API_BASE}/settings/ai`);
    return res.json();
  },

  async updateAiSettings(apiKey: string) {
    const res = await fetch(`${API_BASE}/settings/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey })
    });
    return res.json();
  }
};
