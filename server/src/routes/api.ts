import { Router, Request, Response } from 'express';
import { storage } from '../services/storageService.js';
import { youtubeService } from '../services/youtubeService.js';
import { nemotronService } from '../services/nemotronService.js';
import { groqService } from '../services/groqService.js';
import { INote, IQuizAttempt } from '../models/types.js';

export const apiRouter = Router();

apiRouter.get('/health', async (_req: Request, res: Response) => {
  const isMongo = storage.getIsConnected();
  const nemotronStatus = nemotronService.getApiKeyStatus();
  res.json({
    status: 'online',
    platform: 'LEARNBYTE',
    version: '2.0.0',
    database: isMongo ? 'MongoDB (Connected)' : 'Local Reactive Engine (Ready)',
    nemotron: nemotronStatus
  });
});

apiRouter.get('/user', async (_req: Request, res: Response) => {
  const user = await storage.getUser('user_default');
  res.json(user);
});

apiRouter.patch('/user', async (req: Request, res: Response) => {
  const updated = await storage.updateUser('user_default', req.body);
  res.json(updated);
});

apiRouter.get('/courses', async (req: Request, res: Response) => {
  const { category, search } = req.query;
  let courses = await storage.getCourses();

  if (category && category !== 'All') {
    courses = courses.filter(c => c.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    courses = courses.filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.description.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json(courses);
});

apiRouter.get('/courses/:id', async (req: Request, res: Response) => {
  const course = await storage.getCourseById(req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const progress = await storage.getProgress('user_default', course._id);
  res.json({
    ...course,
    progress: progress || {
      completedLessonIds: [],
      percentCompleted: 0,
      lastLessonId: course.modules[0]?.lessons[0]?._id
    }
  });
});

apiRouter.post('/courses/validate-url', async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const parsed = youtubeService.parseUrl(url);
    if (!parsed.videoId && !parsed.playlistId) {
      return res.status(400).json({ error: 'Please enter a valid YouTube video or playlist URL.' });
    }
    const metadata = await youtubeService.getVideoMetadata(url);
    res.json({ valid: true, metadata });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Could not validate YouTube URL.' });
  }
});

apiRouter.post('/courses/generate', async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'YouTube URL is required' });
  }

  try {
    console.log(`\n🚀 Starting LearnByte Course Generation for: ${url}`);

    const videoMetadata = await youtubeService.getVideoMetadata(url);
    console.log(`✓ Fetched video metadata: "${videoMetadata.title}" (${videoMetadata.durationFormatted})`);

    const transcript = await youtubeService.getTranscript(
      videoMetadata.videoId,
      videoMetadata.title,
      videoMetadata.durationSeconds
    );
    console.log(`✓ Extracted transcript with ${transcript.segments.length} timestamped segments.`);

    const configuredProvider = process.env.AI_PROVIDER?.toLowerCase();
    const isGroqActive = configuredProvider
      ? configuredProvider === 'groq'
      : groqService.getStatus().active;
    const aiResult = isGroqActive
      ? await groqService.generateCourseFromTranscript(videoMetadata, transcript.rawText)
      : await nemotronService.generateCourseFromTranscript(videoMetadata, transcript.rawText);

    const { course, quizzes, generatorModel, isDemoMode } = aiResult;

    await storage.saveCourse(course);

    transcript.courseId = course._id;
    await storage.saveTranscript(transcript);

    for (const q of quizzes) {
      await storage.saveQuiz(q);
    }

    await storage.updateLessonProgress('user_default', course._id, course.modules[0]?.lessons[0]?._id, false, 0);

    console.log(`✅ Successfully generated course: "${course.title}" with ${course.modules.length} modules.`);

    res.status(201).json({
      success: true,
      course,
      quizzesCount: quizzes.length,
      generatorModel,
      isDemoMode,
      message: `Course "${course.title}" successfully created.`
    });
  } catch (err: any) {
    console.error('Course generation failed:', err);
    res.status(500).json({
      error: err.message || 'An error occurred during course generation. Please check the YouTube link and try again.'
    });
  }
});

apiRouter.delete('/courses/:id', async (req: Request, res: Response) => {
  await storage.deleteCourse(req.params.id);
  res.json({ success: true, message: 'Course deleted successfully' });
});

apiRouter.get('/courses/:courseId/lessons/:lessonId', async (req: Request, res: Response) => {
  const { courseId, lessonId } = req.params;
  const course = await storage.getCourseById(courseId);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  let foundLesson = null;
  let foundModule = null;

  for (const m of course.modules) {
    for (const l of m.lessons) {
      if (l._id === lessonId) {
        foundLesson = l;
        foundModule = m;
        break;
      }
    }
    if (foundLesson) break;
  }

  if (!foundLesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  const quiz = await storage.getQuizByLesson(lessonId);

  const notes = await storage.getNotes('user_default', courseId);
  const lessonNotes = notes.filter(n => n.lessonId === lessonId);

  const transcript = await storage.getTranscript(courseId);
  const relevantSegments = (transcript?.segments || []).filter(
    s => s.start >= foundLesson.startTime && s.start <= foundLesson.endTime
  );

  res.json({
    course: {
      _id: course._id,
      title: course.title,
      videoId: course.videoId,
      channelTitle: course.channelTitle,
      modules: course.modules
    },
    module: foundModule,
    lesson: foundLesson,
    quiz,
    notes: lessonNotes,
    transcriptSegments: relevantSegments
  });
});

apiRouter.post('/courses/:courseId/lessons/:lessonId/progress', async (req: Request, res: Response) => {
  const { courseId, lessonId } = req.params;
  const { completed, timestamp } = req.body;

  const prog = await storage.updateLessonProgress(
    'user_default',
    courseId,
    lessonId,
    Boolean(completed),
    typeof timestamp === 'number' ? timestamp : undefined
  );

  if (completed) {
    const user = await storage.getUser('user_default');
    await storage.updateUser('user_default', {
      completedLessonsCount: user.completedLessonsCount + 1,
      totalHoursStudied: Number((user.totalHoursStudied + 0.4).toFixed(1))
    });
  }

  res.json(prog);
});

apiRouter.get('/quizzes/course/:courseId', async (req: Request, res: Response) => {
  const quizzes = await storage.getQuizzesByCourse(req.params.courseId);
  res.json(quizzes);
});

apiRouter.get('/quizzes/lesson/:lessonId', async (req: Request, res: Response) => {
  const quiz = await storage.getQuizByLesson(req.params.lessonId);
  if (!quiz) {
    return res.status(404).json({ error: 'No quiz found for this lesson.' });
  }
  res.json(quiz);
});

apiRouter.post('/quizzes/:quizId/attempt', async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const { answers, courseId, lessonId } = req.body;

  let quiz: any = null;
  const allQuizzes = await storage.getQuizzesByCourse(courseId || '');
  quiz = allQuizzes.find(q => q._id === quizId);

  if (!quiz) {
    quiz = await storage.getQuizByLesson(lessonId || '');
  }

  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }

  let correctCount = 0;
  const gradedAnswers = (quiz.questions || []).map((q: any) => {
    const userAnswer = answers?.[q.id];
    let isCorrect = false;

    if (q.type === 'multiple_choice' || q.type === 'true_false') {
      isCorrect = String(userAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
    } else if (q.type === 'short_answer') {
      const u = String(userAnswer || '').trim().toLowerCase();
      const c = String(q.correctAnswer).trim().toLowerCase();
      isCorrect = u === c || u.includes(c) || c.includes(u);
    }

    if (isCorrect) correctCount++;

    return {
      questionId: q.id,
      question: q.question,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
      relevantTimestamp: q.relevantTimestamp,
      concept: q.concept
    };
  });

  const totalQuestions = quiz.questions.length;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100;

  const attempt: IQuizAttempt = {
    _id: `att_${Date.now()}`,
    quizId,
    courseId: quiz.courseId,
    lessonId: quiz.lessonId,
    score: scorePercent,
    totalQuestions,
    answers: gradedAnswers,
    completedAt: new Date()
  };

  await storage.saveQuizAttempt(attempt);

  res.json({
    score: scorePercent,
    correctCount,
    totalQuestions,
    gradedAnswers,
    completedAt: attempt.completedAt
  });
});

apiRouter.get('/quizzes/attempts', async (req: Request, res: Response) => {
  const { courseId } = req.query;
  const attempts = await storage.getQuizAttempts(courseId ? String(courseId) : undefined);
  res.json(attempts);
});

apiRouter.get('/notes', async (req: Request, res: Response) => {
  const { courseId, search } = req.query;
  let notes = await storage.getNotes('user_default', courseId ? String(courseId) : undefined);

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    notes = notes.filter(n => 
      n.title.toLowerCase().includes(q) || 
      n.content.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json(notes);
});

apiRouter.post('/notes', async (req: Request, res: Response) => {
  const { courseId, lessonId, title, content, timestamp, tags } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Note content is required' });
  }

  const ts = typeof timestamp === 'number' ? timestamp : 0;
  const mins = Math.floor(ts / 60);
  const secs = Math.floor(ts % 60);
  const timestampFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  const newNote: INote = {
    _id: `note_${Date.now()}`,
    userId: 'user_default',
    courseId: courseId || 'course_devops_30h',
    lessonId: lessonId || 'les_1_1',
    title: title || `Note at ${timestampFormatted}`,
    content,
    timestamp: ts,
    timestampFormatted,
    tags: Array.isArray(tags) ? tags : ['Study'],
    bookmarked: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const saved = await storage.createNote(newNote);
  res.status(201).json(saved);
});

apiRouter.put('/notes/:id', async (req: Request, res: Response) => {
  const updated = await storage.updateNote(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.json(updated);
});

apiRouter.delete('/notes/:id', async (req: Request, res: Response) => {
  await storage.deleteNote(req.params.id);
  res.json({ success: true, message: 'Note deleted' });
});

apiRouter.post('/notes/:id/bookmark', async (req: Request, res: Response) => {
  const notes = await storage.getNotes('user_default');
  const target = notes.find(n => n._id === req.params.id);
  if (!target) {
    return res.status(404).json({ error: 'Note not found' });
  }
  const updated = await storage.updateNote(req.params.id, { bookmarked: !target.bookmarked });
  res.json(updated);
});

apiRouter.get('/study-plan', async (_req: Request, res: Response) => {
  const plan = await storage.getStudyPlan('user_default');
  res.json(plan);
});

apiRouter.post('/study-plan', async (req: Request, res: Response) => {
  const { dailyStudyHours, targetCompletionDate, schedulePreference, courseId } = req.body;

  const course = await storage.getCourseById(courseId || 'course_devops_30h');
  const existingPlan = await storage.getStudyPlan('user_default');

  const tasks: any[] = [];
  const hours = Number(dailyStudyHours) || 2;
  const dailyMinutes = hours * 60;

  if (course) {
    let dayOffset = 0;
    let currentDayMinutes = 0;
    const baseDate = new Date();

    for (const m of course.modules) {
      for (const l of m.lessons) {

        const parts = l.duration.split(':');
        const lessonMins = Math.max(10, parseInt(parts[0], 10) || 15);

        if (currentDayMinutes + lessonMins > dailyMinutes) {
          dayOffset++;
          currentDayMinutes = 0;
        }
        currentDayMinutes += lessonMins;

        const taskDate = new Date(baseDate);
        taskDate.setDate(baseDate.getDate() + dayOffset);
        const dateStr = taskDate.toISOString().split('T')[0];

        tasks.push({
          id: `task_${l._id}`,
          lessonId: l._id,
          courseId: course._id,
          courseTitle: course.title,
          lessonTitle: l.title,
          durationMinutes: lessonMins,
          targetDate: dateStr,
          completed: l.completed || false
        });
      }
    }
  }

  const updatedPlan = {
    _id: existingPlan?._id || `plan_${Date.now()}`,
    userId: 'user_default',
    courseId: courseId || 'course_devops_30h',
    dailyStudyHours: hours,
    targetCompletionDate: targetCompletionDate || '2026-12-25',
    schedulePreference: schedulePreference || 'daily',
    tasks: tasks.length > 0 ? tasks : (existingPlan?.tasks || []),
    createdAt: existingPlan?.createdAt || new Date(),
    updatedAt: new Date()
  };

  await storage.saveStudyPlan(updatedPlan);
  res.json(updatedPlan);
});

apiRouter.patch('/study-plan/tasks/:taskId', async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { completed } = req.body;
  const plan = await storage.toggleStudyTask('user_default', taskId, Boolean(completed));
  res.json(plan);
});

apiRouter.get('/dashboard', async (_req: Request, res: Response) => {
  const user = await storage.getUser('user_default');
  const courses = await storage.getCourses();
  const enrolledCourses = courses.filter(c => c.enrolled);
  const notes = await storage.getNotes('user_default');
  const attempts = await storage.getQuizAttempts();
  const studyPlan = await storage.getStudyPlan('user_default');

  const avgQuizScore = attempts.length > 0 
    ? Math.round(attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length)
    : 88;

  const weeklyActivity = [
    { day: 'Mon', hours: 2.5, completedLessons: 2 },
    { day: 'Tue', hours: 3.2, completedLessons: 3 },
    { day: 'Wed', hours: 1.8, completedLessons: 1 },
    { day: 'Thu', hours: 4.0, completedLessons: 4 },
    { day: 'Fri', hours: 2.1, completedLessons: 2 },
    { day: 'Sat', hours: 3.5, completedLessons: 3 },
    { day: 'Sun', hours: 1.5, completedLessons: 1 }
  ];

  res.json({
    user,
    stats: {
      enrolledCoursesCount: enrolledCourses.length,
      completedLessonsCount: user.completedLessonsCount,
      totalHoursStudied: user.totalHoursStudied,
      studyStreakDays: user.studyStreak,
      avgQuizScore,
      totalQuizzesTaken: attempts.length > 0 ? attempts.length : 14,
      totalNotesCreated: notes.length,
      weeklyActivity
    },
    recentCourses: enrolledCourses.slice(0, 3),
    todayTasks: (studyPlan?.tasks || []).filter(t => !t.completed).slice(0, 4)
  });
});

apiRouter.get('/settings/ai', (_req: Request, res: Response) => {
  const configuredProvider = process.env.AI_PROVIDER?.toLowerCase();
  const groqStatus = groqService.getStatus();
  if ((!configuredProvider || configuredProvider === 'groq') && groqStatus.active) {
    return res.json({
      hasKey: true,
      maskedKey: groqStatus.maskedKey,
      model: groqStatus.model,
      provider: 'Groq Cloud LPU (Active)'
    });
  }
  res.json(nemotronService.getApiKeyStatus());
});

apiRouter.post('/settings/ai', (req: Request, res: Response) => {
  const { apiKey } = req.body;
  if (typeof apiKey === 'string') {
    const trimmed = apiKey.trim();
    if (trimmed.startsWith('gsk_')) {
      groqService.setApiKey(trimmed);
    }
    nemotronService.setApiKey(trimmed);
  }
  const groqStatus = groqService.getStatus();
  res.json({
    success: true,
    status: groqStatus.active
      ? { hasKey: true, maskedKey: groqStatus.maskedKey, model: groqStatus.model, provider: 'Groq Cloud LPU' }
      : nemotronService.getApiKeyStatus()
  });
});
