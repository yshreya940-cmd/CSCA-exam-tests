import { UserProgress, QuizSession, MistakeRecord, Question, Subject } from '../types/csca';
import { OFFICIAL_QUESTION_BANK } from '../data/questionBank';

const STORAGE_KEY = 'csca_user_progress_v1';

/**
 * Strips all undefined properties from an object recursively
 * to ensure zero-crash clean payload hygiene.
 */
export function sanitizePayload<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => (value === undefined ? null : value))
  );
}

const DEFAULT_SUBJECT_STATS: Record<Subject, {
  attempted: number;
  correct: number;
  testsTaken: number;
  highestScore: number;
  latestScore: number;
}> = {
  Mathematics: { attempted: 0, correct: 0, testsTaken: 0, highestScore: 0, latestScore: 0 },
  Physics: { attempted: 0, correct: 0, testsTaken: 0, highestScore: 0, latestScore: 0 },
  Chemistry: { attempted: 0, correct: 0, testsTaken: 0, highestScore: 0, latestScore: 0 },
  'Professional Chinese': { attempted: 0, correct: 0, testsTaken: 0, highestScore: 0, latestScore: 0 },
};

export const INITIAL_USER_PROGRESS: UserProgress = {
  candidateId: 'CSC-2025-IN9834',
  candidateName: 'Scholar Aspirant',
  candidateEmail: 'candidate@csca.edu.cn',
  applicationType: 'CGS',
  targetUniversity: 'Tsinghua University / Peking University',
  registeredSubjects: ['Mathematics', 'Physics', 'Chemistry', 'Professional Chinese'],
  sessionsHistory: [],
  totalQuestionsAttempted: 0,
  totalCorrect: 0,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  subjectStats: { ...DEFAULT_SUBJECT_STATS },
  moduleMastery: {},
  mistakeBook: [],
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveUserProgress(INITIAL_USER_PROGRESS);
      return INITIAL_USER_PROGRESS;
    }
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_USER_PROGRESS,
      ...parsed,
      subjectStats: {
        ...DEFAULT_SUBJECT_STATS,
        ...(parsed.subjectStats || {}),
      },
      moduleMastery: parsed.moduleMastery || {},
      mistakeBook: parsed.mistakeBook || [],
      sessionsHistory: parsed.sessionsHistory || [],
    };
  } catch (e) {
    console.error('Failed to load user progress from storage:', e);
    return INITIAL_USER_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): boolean {
  try {
    const clean = sanitizePayload(progress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    return true;
  } catch (e) {
    console.error('Failed to save user progress:', e);
    return false;
  }
}

/**
 * Record a completed quiz session into the user's progress and update all metrics
 */
export function recordCompletedSession(session: QuizSession): UserProgress {
  const current = loadUserProgress();
  const sessionCopy = sanitizePayload(session);

  const updatedHistory = [sessionCopy, ...current.sessionsHistory.filter(s => s.id !== session.id)];

  // Update question counts
  let newAttempted = current.totalQuestionsAttempted + session.questions.length;
  let newCorrect = current.totalCorrect + session.correctCount;

  // Update subject stats
  const updatedSubjectStats = { ...current.subjectStats };
  if (session.subject !== 'All' && updatedSubjectStats[session.subject]) {
    const sStat = updatedSubjectStats[session.subject];
    sStat.attempted += session.questions.length;
    sStat.correct += session.correctCount;
    sStat.testsTaken += 1;
    sStat.latestScore = session.score;
    if (session.score > sStat.highestScore) {
      sStat.highestScore = session.score;
    }
  }

  // Update module mastery & mistake book
  const updatedModuleMastery = { ...current.moduleMastery };
  let updatedMistakes = [...current.mistakeBook];

  session.questions.forEach((q, idx) => {
    const userAnswer = session.userAnswers[idx];
    const isCorrect = userAnswer === q.correctOption;

    // Module mastery
    const modKey = `${q.subject}::${q.module}`;
    if (!updatedModuleMastery[modKey]) {
      updatedModuleMastery[modKey] = {
        subject: q.subject,
        attempted: 0,
        correct: 0,
      };
    }
    updatedModuleMastery[modKey].attempted += 1;
    if (isCorrect) {
      updatedModuleMastery[modKey].correct += 1;
    }

    // Mistake book management
    const existingMistakeIndex = updatedMistakes.findIndex(m => m.questionId === q.id);
    if (!isCorrect && userAnswer !== undefined) {
      if (existingMistakeIndex >= 0) {
        const m = updatedMistakes[existingMistakeIndex];
        m.incorrectAttempts += 1;
        m.lastFailedAt = new Date().toISOString();
        m.selectedOption = userAnswer;
        m.consecutiveCorrect = 0;
        m.resolved = false;
      } else {
        updatedMistakes.push({
          questionId: q.id,
          question: q,
          selectedOption: userAnswer,
          firstFailedAt: new Date().toISOString(),
          lastFailedAt: new Date().toISOString(),
          incorrectAttempts: 1,
          consecutiveCorrect: 0,
          resolved: false,
        });
      }
    } else if (isCorrect && existingMistakeIndex >= 0) {
      const m = updatedMistakes[existingMistakeIndex];
      m.consecutiveCorrect += 1;
      if (m.consecutiveCorrect >= 2) {
        m.resolved = true;
      }
    }
  });

  // Check streak
  const today = new Date().toISOString().split('T')[0];
  let streak = current.streakDays;
  if (current.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (current.lastActiveDate === yesterday) {
      streak += 1;
    } else {
      streak = 1;
    }
  }

  const updatedProgress: UserProgress = {
    ...current,
    totalQuestionsAttempted: newAttempted,
    totalCorrect: newCorrect,
    sessionsHistory: updatedHistory,
    subjectStats: updatedSubjectStats,
    moduleMastery: updatedModuleMastery,
    mistakeBook: updatedMistakes,
    streakDays: streak,
    lastActiveDate: today,
  };

  saveUserProgress(updatedProgress);
  return updatedProgress;
}

/**
 * Seed realistic baseline progress data for first-time visitors
 */
export function seedBaselineProgress(): UserProgress {
  const current = loadUserProgress();
  if (current.sessionsHistory.length > 0) return current;

  // Create a realistic sample mock exam test for Mathematics & Physics
  const sampleMathQuestions = OFFICIAL_QUESTION_BANK.filter(q => q.subject === 'Mathematics');
  const samplePhysQuestions = OFFICIAL_QUESTION_BANK.filter(q => q.subject === 'Physics');

  const mathSession: QuizSession = {
    id: 'seed-math-01',
    mode: 'topic',
    subject: 'Mathematics',
    moduleTitle: 'Functions & Calculus',
    totalQuestions: sampleMathQuestions.length,
    timeLimitSeconds: 1800,
    timeSpentSeconds: 742,
    questions: sampleMathQuestions,
    userAnswers: { 0: 1, 1: 0, 2: 1, 3: 1, 4: 1 }, // 4 correct, 1 wrong
    flaggedQuestions: { 3: true },
    isCompleted: true,
    score: 80,
    correctCount: 4,
    incorrectCount: 1,
    unansweredCount: 0,
    accuracy: 80,
    startedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 2 + 742000).toISOString(),
  };

  const physSession: QuizSession = {
    id: 'seed-phys-01',
    mode: 'mock',
    subject: 'Physics',
    totalQuestions: samplePhysQuestions.length,
    timeLimitSeconds: 3600,
    timeSpentSeconds: 1980,
    questions: samplePhysQuestions,
    userAnswers: { 0: 1, 1: 2, 2: 0, 3: 1, 4: 1 }, // 5 correct (100%)
    flaggedQuestions: {},
    isCompleted: true,
    score: 100,
    correctCount: 5,
    incorrectCount: 0,
    unansweredCount: 0,
    accuracy: 100,
    startedAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86400000 + 1980000).toISOString(),
  };

  recordCompletedSession(mathSession);
  return recordCompletedSession(physSession);
}
