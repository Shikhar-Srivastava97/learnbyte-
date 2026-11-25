export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  studyStreak: number;
  totalHoursStudied: number;
  completedLessonsCount: number;
  preferredStudyHoursPerDay: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITranscriptSegment {
  start: number; 
  duration: number; 
  text: string;
}

export interface ITranscript {
  _id: string;
  courseId: string;
  videoId: string;
  language: string;
  segments: ITranscriptSegment[];
  rawText: string;
  createdAt: Date;
}

export interface ILesson {
  _id: string;
  moduleId: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  startTime: number; 
  endTime: number; 
  duration: string; 
  learningObjectives: string[];
  keyConcepts: string[];
  summary: string;
  notesMarkdown?: string;
  completed?: boolean;
}

export interface IModule {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: ILesson[];
}

export interface ICourse {
  _id: string;
  title: string;
  description: string;
  category: 'DevOps' | 'Programming' | 'AI & Machine Learning' | 'Cloud Computing' | 'Web Development' | 'General';
  sourceUrl: string;
  videoId: string;
  isPlaylist: boolean;
  channelTitle: string;
  thumbnailUrl: string;
  totalDuration: string;
  totalDurationSeconds: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  learningObjectives: string[];
  modules: IModule[];
  generatorModel: string;
  isDemo: boolean;
  isUserPasted?: boolean;
  enrolled: boolean;
  progressPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface IQuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; 
  correctAnswer: string | number;
  explanation: string;
  relevantTimestamp: number; 
  concept: string;
}

export interface IQuiz {
  _id: string;
  courseId: string;
  moduleId?: string;
  lessonId?: string;
  title: string;
  description: string;
  questions: IQuizQuestion[];
  createdAt: Date;
}

export interface IQuizAttempt {
  _id: string;
  quizId: string;
  courseId: string;
  lessonId?: string;
  score: number;
  totalQuestions: number;
  answers: {
    questionId: string;
    userAnswer: string | number;
    isCorrect: boolean;
  }[];
  completedAt: Date;
}

export interface INote {
  _id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  title: string;
  content: string;
  timestamp: number; 
  timestampFormatted: string; 
  tags: string[];
  bookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudyTask {
  id: string;
  lessonId: string;
  courseId: string;
  courseTitle: string;
  lessonTitle: string;
  durationMinutes: number;
  targetDate: string; 
  completed: boolean;
  completedAt?: Date;
}

export interface IStudyPlan {
  _id: string;
  userId: string;
  courseId?: string;
  dailyStudyHours: number;
  targetCompletionDate: string;
  schedulePreference: 'daily' | 'weekdays' | 'weekends';
  tasks: IStudyTask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProgress {
  _id: string;
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  lastLessonId?: string;
  lastTimestamp?: number;
  percentCompleted: number;
  updatedAt: Date;
}
