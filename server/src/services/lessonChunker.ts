import { IModule } from '../models/types.js';

const MAX_LESSON_SECONDS = 15 * 60;

export function makeLessonsBiteSized(
  modules: IModule[],
  courseId: string,
  totalDurationSeconds: number
): IModule[] {
  const sourceLessons = modules.flatMap(module => module.lessons.map(lesson => ({ module, lesson })));
  if (sourceLessons.length === 0 || totalDurationSeconds <= 0) return modules;

  const sourceIntervals = sourceLessons.map(({ lesson }) => ({
    start: lesson.startTime,
    end: lesson.endTime
  }));
  const hasCompleteTimeline = sourceIntervals[0].start === 0
    && sourceIntervals[sourceIntervals.length - 1].end === totalDurationSeconds
    && sourceIntervals.every((interval, index) =>
      Number.isFinite(interval.start)
      && Number.isFinite(interval.end)
      && interval.end > interval.start
      && (index === 0 || sourceIntervals[index - 1].end === interval.start)
    );
  const weights = sourceIntervals.map(interval => {
    const duration = interval.end - interval.start;
    return Number.isFinite(duration) && duration > 0 ? duration : 1;
  });
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  let sourceIndex = 0;
  let lessonNumber = 0;
  let accumulatedWeight = 0;
  return modules.map(module => {
    let moduleLessonOrder = 0;
    const lessons = module.lessons.flatMap(lesson => {
      const start = hasCompleteTimeline
        ? sourceIntervals[sourceIndex].start
        : Math.floor(totalDurationSeconds * accumulatedWeight / totalWeight);
      accumulatedWeight += weights[sourceIndex];
      sourceIndex += 1;
      const end = hasCompleteTimeline
        ? sourceIntervals[sourceIndex - 1].end
        : Math.floor(totalDurationSeconds * accumulatedWeight / totalWeight);
      const partCount = Math.ceil((end - start) / MAX_LESSON_SECONDS);

      return Array.from({ length: partCount }, (_, partIndex) => {
        const lessonStart = start + partIndex * MAX_LESSON_SECONDS;
        const lessonEnd = Math.min(end, lessonStart + MAX_LESSON_SECONDS);
        const durationSeconds = lessonEnd - lessonStart;
        const minutes = Math.floor(durationSeconds / 60);
        const seconds = durationSeconds % 60;
        lessonNumber += 1;
        moduleLessonOrder += 1;

        return {
          ...lesson,
          _id: `les_${courseId}_${lessonNumber}`,
          moduleId: module._id,
          courseId,
          title: partCount > 1 ? `${lesson.title} - Part ${partIndex + 1}` : lesson.title,
          order: moduleLessonOrder,
          startTime: lessonStart,
          endTime: lessonEnd,
          duration: `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
        };
      });
    });

    return { ...module, lessons };
  });
}
