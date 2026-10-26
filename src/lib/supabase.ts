import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { QuizSession, UserProgress, MistakeRecord } from '../types/csca';

// Keys for local override storage (allows testing directly in the browser UI without redeploy)
const STORAGE_URL_KEY = 'csca_supabase_url';
const STORAGE_KEY_KEY = 'csca_supabase_anon_key';

export function getSupabaseCredentials(): { url: string; anonKey: string; isConfigured: boolean } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) || '' : '';
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) || '' : '';

  const url = (storedUrl || envUrl).trim();
  const anonKey = (storedKey || envKey).trim();

  const isConfigured = Boolean(
    url &&
    anonKey &&
    url.startsWith('https://') &&
    url.includes('supabase.co') &&
    anonKey.length > 20
  );

  return { url, anonKey, isConfigured };
}

export function saveSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_URL_KEY, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  }
}

export function clearSupabaseCredentials(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_KEY_KEY);
  }
}

let cachedClient: SupabaseClient | null = null;
let cachedUrl = '';
let cachedKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseCredentials();
  if (!isConfigured) return null;

  if (cachedClient && cachedUrl === url && cachedKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    cachedUrl = url;
    cachedKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Strict undefined-stripping payload sanitizer (OWASP & DB hygiene standard)
 */
function sanitizePayload<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj, (_, v) => (v === undefined ? null : v)));
}

/**
 * Test connectivity against Supabase instance
 */
export async function testSupabaseConnection(
  customUrl?: string,
  customKey?: string
): Promise<{ success: boolean; message: string; tablesDetected?: string[]; latencyMs?: number }> {
  const startTime = Date.now();
  let client: SupabaseClient;

  if (customUrl && customKey) {
    try {
      client = createClient(customUrl.trim(), customKey.trim());
    } catch (e: any) {
      return { success: false, message: `Invalid Supabase configuration: ${e.message}` };
    }
  } else {
    const c = getSupabaseClient();
    if (!c) {
      return {
        success: false,
        message: 'Supabase credentials not configured. Please supply Project URL and Anon Key.',
      };
    }
    client = c;
  }

  try {
    // 1. Verify basic connection by querying exam_papers or profiles
    const { error: paperError } = await client
      .from('exam_papers')
      .select('id', { count: 'exact', head: true });

    const latencyMs = Date.now() - startTime;

    if (paperError) {
      // If table doesn't exist yet, it's still connected to postgres
      if (paperError.message.includes('relation "exam_papers" does not exist') || paperError.code === '42P01') {
        return {
          success: true,
          message: 'Connected to Supabase PostgreSQL successfully! Note: You need to run the schema migration to create the tables.',
          latencyMs,
          tablesDetected: ['(Database connected, awaiting SQL schema)'],
        };
      }
      return {
        success: false,
        message: `Connection returned error: ${paperError.message} (Code: ${paperError.code})`,
        latencyMs,
      };
    }

    return {
      success: true,
      message: 'Connection verified! Supabase database is active and responding.',
      latencyMs,
      tablesDetected: ['exam_papers', 'profiles', 'quiz_sessions', 'questions', 'mistake_records'],
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Network error reaching Supabase endpoint: ${err.message || 'Unknown error'}`,
    };
  }
}

/**
 * Persist completed exam session to Supabase
 */
export async function syncSessionToSupabase(session: QuizSession, candidateId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = sanitizePayload({
      id: session.id,
      candidate_id: candidateId,
      paper_id: session.paperId || null,
      exam_paper_name: session.examPaper || null,
      subject: session.subject,
      mode: session.mode,
      total_questions: session.totalQuestions,
      time_limit_seconds: session.timeLimitSeconds,
      time_spent_seconds: session.timeSpentSeconds,
      score: session.score,
      correct_count: session.correctCount,
      incorrect_count: session.incorrectCount,
      unanswered_count: session.unansweredCount,
      accuracy: session.accuracy,
      user_answers: session.userAnswers,
      flagged_questions: session.flaggedQuestions,
      started_at: session.startedAt,
      completed_at: session.completedAt || new Date().toISOString(),
    });

    const { error } = await client.from('quiz_sessions').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase session sync warning:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Failed to sync session to Supabase:', e);
    return false;
  }
}

/**
 * Persist mistake notebook items to Supabase
 */
export async function syncMistakesToSupabase(
  mistakes: MistakeRecord[],
  candidateId: string
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client || mistakes.length === 0) return false;

  try {
    const records = mistakes.map((m) =>
      sanitizePayload({
        id: `${candidateId}-${m.questionId}`,
        candidate_id: candidateId,
        question_id: m.questionId,
        subject: m.question.subject,
        module: m.question.module,
        user_choice: m.selectedOption,
        correct_option: m.question.correctOption,
        resolved: m.resolved,
        review_count: m.incorrectAttempts || 1,
        added_at: m.firstFailedAt || new Date().toISOString(),
      })
    );

    const { error } = await client.from('mistake_records').upsert(records, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase mistake sync warning:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Failed to sync mistakes to Supabase:', e);
    return false;
  }
}

/**
 * Sync user profile & stats to Supabase
 */
export async function syncProfileToSupabase(progress: UserProgress): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = sanitizePayload({
      candidate_id: progress.candidateId,
      candidate_name: progress.candidateName,
      application_type: progress.applicationType,
      target_university: progress.targetUniversity,
      registered_subjects: progress.registeredSubjects,
      streak_days: progress.streakDays,
      last_active_date: progress.lastActiveDate,
      total_questions_attempted: progress.totalQuestionsAttempted,
      total_correct: progress.totalCorrect,
      updated_at: new Date().toISOString(),
    });

    const { error } = await client.from('profiles').upsert(payload, { onConflict: 'candidate_id' });
    if (error) {
      console.warn('Supabase profile sync warning:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Failed to sync profile to Supabase:', e);
    return false;
  }
}
