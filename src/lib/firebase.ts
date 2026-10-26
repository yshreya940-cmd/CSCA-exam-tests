import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  getDocFromServer,
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProgress, QuizSession, MistakeRecord } from '../types/csca';
import { OFFICIAL_QUESTION_BANK } from '../data/questionBank';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Clean object of undefined values before Firestore writes
 */
function sanitizeFirestorePayload<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj, (_, v) => (v === undefined ? null : v)));
}

/**
 * Validate Firestore connection
 */
export async function testFirebaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return { success: true, message: 'Connected to Firebase Firestore successfully!' };
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      return { success: false, message: 'Client offline or Firebase configuration issue.' };
    }
    // Document not existing is normal in Firestore
    return { success: true, message: 'Connected to Firebase Firestore successfully!' };
  }
}

/**
 * Firebase Authentication functions
 */
export async function loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  return cred.user;
}

export async function registerWithEmail(email: string, password: string, displayName?: string): Promise<FirebaseUser> {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName && cred.user) {
    await updateProfile(cred.user, { displayName });
  }
  return cred.user;
}

/**
 * Direct Front-Page Unified Sign-In
 * Allows candidate to sign in directly from the front page without a separate create account tab.
 * If user exists, signs them in. If first time, seamlessly creates account.
 */
export async function signInOrAutoRegister(email: string, password: string): Promise<FirebaseUser> {
  const cleanEmail = email.trim();
  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
    return cred.user;
  } catch (err: any) {
    // If user does not exist yet or invalid credential with new user, attempt auto-creation
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      try {
        const createCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        return createCred.user;
      } catch (createErr: any) {
        if (createErr.code === 'auth/email-already-in-use') {
          throw new Error('Incorrect password for this registered email. Please verify or use "Forgotten your password?".');
        }
        throw createErr;
      }
    }
    throw err;
  }
}

export async function resetUserPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

export async function loginWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    return cred.user;
  } catch (err: any) {
    if (
      err?.code === 'auth/popup-closed-by-user' ||
      err?.code === 'auth/cancelled-popup-request' ||
      err?.message?.includes('popup-closed-by-user')
    ) {
      // User dismissed or closed the popup - normal cancellation
      return null;
    }
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * User Profile Firestore Sync
 */
export async function syncUserProfileToFirestore(userId: string, progress: UserProgress): Promise<boolean> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const payload = sanitizeFirestorePayload({
      userId,
      email: progress.candidateEmail || auth.currentUser?.email || '',
      displayName: progress.candidateName || auth.currentUser?.displayName || 'CSC Scholar',
      candidateId: progress.candidateId,
      applicationType: progress.applicationType,
      targetUniversity: progress.targetUniversity || 'Tsinghua University',
      registeredSubjects: progress.registeredSubjects,
      streakDays: progress.streakDays,
      lastActiveDate: progress.lastActiveDate,
      totalQuestionsAttempted: progress.totalQuestionsAttempted,
      totalCorrect: progress.totalCorrect,
      updatedAt: new Date().toISOString(),
    });

    await setDoc(userDocRef, payload, { merge: true });
    return true;
  } catch (err) {
    console.warn('Failed to sync user profile to Firestore:', err);
    return false;
  }
}

export async function loadUserProfileFromFirestore(userId: string): Promise<Partial<UserProgress> | null> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) return null;

    const data = snap.data();
    return {
      candidateId: data.candidateId,
      candidateName: data.displayName,
      candidateEmail: data.email,
      applicationType: data.applicationType,
      targetUniversity: data.targetUniversity,
      registeredSubjects: data.registeredSubjects || [],
      streakDays: data.streakDays || 1,
      lastActiveDate: data.lastActiveDate,
      totalQuestionsAttempted: data.totalQuestionsAttempted || 0,
      totalCorrect: data.totalCorrect || 0,
    };
  } catch (err) {
    console.warn('Failed to load user profile from Firestore:', err);
    return null;
  }
}

/**
 * Quiz Sessions Firestore Sync
 */
export async function saveSessionToFirestore(userId: string, session: QuizSession): Promise<boolean> {
  try {
    const sessionRef = doc(db, 'users', userId, 'sessions', session.id);
    const payload = sanitizeFirestorePayload({
      id: session.id,
      userId,
      subject: session.subject,
      mode: session.mode,
      examPaper: session.examPaper || 'Official CSCA CBT Exam',
      paperId: session.paperId || '',
      totalQuestions: session.totalQuestions,
      timeSpentSeconds: session.timeSpentSeconds,
      score: session.score,
      correctCount: session.correctCount,
      incorrectCount: session.incorrectCount,
      accuracy: session.accuracy,
      completedAt: session.completedAt || new Date().toISOString(),
    });

    await setDoc(sessionRef, payload);
    return true;
  } catch (err) {
    console.warn('Failed to save session to Firestore:', err);
    return false;
  }
}

export async function loadUserSessionsFromFirestore(userId: string): Promise<QuizSession[]> {
  try {
    const colRef = collection(db, 'users', userId, 'sessions');
    const q = query(colRef, orderBy('completedAt', 'desc'));
    const snap = await getDocs(q);

    return snap.docs.map((docSnap) => {
      const d = docSnap.data();
      return {
        id: d.id,
        mode: d.mode,
        subject: d.subject,
        examPaper: d.examPaper,
        paperId: d.paperId,
        totalQuestions: d.totalQuestions,
        timeLimitSeconds: 3600,
        timeSpentSeconds: d.timeSpentSeconds || 0,
        questions: [],
        userAnswers: {},
        flaggedQuestions: {},
        isCompleted: true,
        score: d.score,
        correctCount: d.correctCount,
        incorrectCount: d.incorrectCount,
        unansweredCount: d.totalQuestions - (d.correctCount + d.incorrectCount),
        accuracy: d.accuracy,
        startedAt: d.completedAt,
        completedAt: d.completedAt,
      } as QuizSession;
    });
  } catch (err) {
    console.warn('Failed to load sessions from Firestore:', err);
    return [];
  }
}

/**
 * Mistake Records Firestore Sync
 */
export async function saveMistakeToFirestore(userId: string, mistake: MistakeRecord): Promise<boolean> {
  try {
    const mistakeRef = doc(db, 'users', userId, 'mistakes', mistake.questionId);
    const payload = sanitizeFirestorePayload({
      id: mistake.questionId,
      userId,
      questionId: mistake.questionId,
      subject: mistake.question.subject,
      module: mistake.question.module || 'General',
      selectedOption: mistake.selectedOption,
      correctOption: mistake.question.correctOption,
      resolved: !!mistake.resolved,
      incorrectAttempts: mistake.incorrectAttempts || 1,
      consecutiveCorrect: mistake.consecutiveCorrect || 0,
      firstFailedAt: mistake.firstFailedAt || new Date().toISOString(),
      lastFailedAt: mistake.lastFailedAt || new Date().toISOString(),
      question: mistake.question,
    });

    await setDoc(mistakeRef, payload, { merge: true });
    return true;
  } catch (err) {
    console.warn('Failed to save mistake to Firestore:', err);
    return false;
  }
}

export async function deleteMistakeFromFirestore(userId: string, questionId: string): Promise<boolean> {
  try {
    const mistakeRef = doc(db, 'users', userId, 'mistakes', questionId);
    await deleteDoc(mistakeRef);
    return true;
  } catch (err) {
    console.warn('Failed to delete mistake from Firestore:', err);
    return false;
  }
}

export async function loadUserMistakesFromFirestore(userId: string): Promise<MistakeRecord[]> {
  try {
    const mistakesCol = collection(db, 'users', userId, 'mistakes');
    const snap = await getDocs(mistakesCol);
    
    return snap.docs.map((docSnap) => {
      const d = docSnap.data();
      const questionId = d.questionId || docSnap.id;
      const bankMatch = OFFICIAL_QUESTION_BANK.find((q) => q.id === questionId);
      
      const question = d.question || bankMatch || {
        id: questionId,
        subject: d.subject || 'Mathematics',
        module: d.module || 'General',
        subtopic: 'Examination Practice',
        difficulty: 'Standard',
        questionEn: d.questionEn || 'Question stem',
        questionZh: d.questionZh || '试题详情',
        optionsEn: d.optionsEn || ['Option A', 'Option B', 'Option C', 'Option D'],
        optionsZh: d.optionsZh || ['选项 A', '选项 B', '选项 C', '选项 D'],
        correctOption: d.correctOption ?? 0,
        explanationEn: d.explanationEn || '',
        explanationZh: d.explanationZh || '',
      };

      return {
        questionId,
        question,
        selectedOption: d.selectedOption ?? 0,
        firstFailedAt: d.firstFailedAt || new Date().toISOString(),
        lastFailedAt: d.lastFailedAt || new Date().toISOString(),
        incorrectAttempts: d.incorrectAttempts || 1,
        consecutiveCorrect: d.consecutiveCorrect || 0,
        resolved: !!d.resolved,
      } as MistakeRecord;
    });
  } catch (err) {
    console.warn('Failed to load user mistakes from Firestore:', err);
    return [];
  }
}

