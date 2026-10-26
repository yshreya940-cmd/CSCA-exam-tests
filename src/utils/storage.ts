import { UserProgress, QuizSession, MistakeRecord, Question, Subject } from '../types/csca';
import { OFFICIAL_QUESTION_BANK } from '../data/questionBank';

export function getStorageKey(userId?: string): string {
  if (userId && userId.trim()) {
    return `csca_user_progress_${userId.trim()}`;
  }
  return 'csca_user_progress_guest';
}

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
  Chinese: { attempted: 0, correct: 0, testsTaken: 0, highestScore: 0, latestScore: 0 },
  'Science Chinese': { attempted: 0, correct: 0, testsTaken: 0, highestScore: 0, latestScore: 0 },
  'Humanities Chinese': { attempted: 0, correct: 0, testsTaken: 0, highestScore: 0, latestScore: 0 },
  'Professional Chinese': { attempted: 0, correct: 0, testsTaken: 0, highestScore: 0, latestScore: 0 },
};

export function createInitialUserProgress(userId?: string, email?: string, name?: string): UserProgress {
  return {
    candidateId: userId ? `CSC-${userId.slice(0, 8).toUpperCase()}` : 'CSC-2026-CANDIDATE',
    candidateName: name || 'CSC Scholar',
    candidateEmail: email || '',
    applicationType: 'CGS',
    targetUniversity: 'Tsinghua University / Peking University / Fudan',
    registeredSubjects: ['Mathematics', 'Physics', 'Chemistry', 'Science Chinese', 'Humanities Chinese'],
    sessionsHistory: [],
    totalQuestionsAttempted: 0,
    totalCorrect: 0,
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    subjectStats: { ...DEFAULT_SUBJECT_STATS },
    moduleMastery: {},
    mistakeBook: [], // Strictly empty for new users: no shared errors!
  };
}

export const INITIAL_USER_PROGRESS: UserProgress = createInitialUserProgress();

export function loadUserProgress(userId?: string): UserProgress {
  try {
    const key = getStorageKey(userId);
    const raw = localStorage.getItem(key);
    if (!raw) {
      const initial = createInitialUserProgress(userId);
      saveUserProgress(initial, userId);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return {
      ...createInitialUserProgress(userId),
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
    return createInitialUserProgress(userId);
  }
}

export function saveUserProgress(progress: UserProgress, userId?: string): boolean {
  try {
    const key = getStorageKey(userId || progress.candidateId);
    const clean = sanitizePayload(progress);
    localStorage.setItem(key, JSON.stringify(clean));
    return true;
  } catch (e) {
    console.error('Failed to save user progress:', e);
    return false;
  }
}

/**
 * Record a completed quiz session into the user's progress and update all metrics
 */
export function recordCompletedSession(session: QuizSession, userId?: string): UserProgress {
  const current = loadUserProgress(userId);
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

  saveUserProgress(updatedProgress, userId);
  return updatedProgress;
}

/**
 * Clean baseline progress - no seeded dummy mistakes!
 */
export function seedBaselineProgress(userId?: string): UserProgress {
  return loadUserProgress(userId);
}

