import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  LogOut, 
  ArrowRight,
  School
} from 'lucide-react';
import { 
  auth, 
  signInOrAutoRegister, 
  loginWithGoogle, 
  logoutUser,
  resetUserPassword,
  syncUserProfileToFirestore
} from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { Language, UserProgress } from '../types/csca';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FirebaseUser | null;
  userProgress: UserProgress;
  onUserLogin: (user: FirebaseUser) => void;
  onUserLogout: () => void;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  userProgress,
  onUserLogin,
  onUserLogout,
  lang,
}) => {
  const isZh = lang === 'zh';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Forgot password
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMsg(isZh ? '请填写邮箱与密码' : 'Please provide both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg(isZh ? '密码长度至少需为 6 位字符' : 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const user = await signInOrAutoRegister(cleanEmail, password);
      onUserLogin(user);
      setSuccessMsg(isZh ? '登录成功！已连接云端 Firestore 个人考籍档案。' : 'Successfully signed in! Connected to Cloud Firestore.');
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = isZh ? '邮箱或密码不正确，请重新输入。' : 'Invalid email or password.';
      } else if (err.code === 'auth/weak-password') {
        msg = isZh ? '密码强度过低，请输入至少 6 个字符。' : 'Weak password. Use at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = isZh ? '请输入有效的邮箱地址。' : 'Invalid email format.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      onUserLogin(user);
      await syncUserProfileToFirestore(user.uid, {
        ...userProgress,
        candidateEmail: user.email || '',
        candidateName: user.displayName || 'CSC Scholar',
      });
      setSuccessMsg(isZh ? 'Google 账号快捷登录成功！' : 'Signed in with Google successfully!');
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      console.error('Google auth error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || 'Google Sign-in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logoutUser();
      onUserLogout();
      setSuccessMsg(isZh ? '已退出账号。' : 'Signed out successfully.');
      setTimeout(() => onClose(), 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Sign out failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg(null);
    setForgotError(null);

    const clean = forgotEmail.trim() || email.trim();
    if (!clean) {
      setForgotError(isZh ? '请输入您的注册邮箱' : 'Please enter your email.');
      return;
    }

    setForgotLoading(true);
    try {
      await resetUserPassword(clean);
      setForgotMsg(isZh ? '密码重置邮件已发送！请查收。' : 'Reset email sent! Please check your inbox.');
    } catch (err: any) {
      setForgotError(err.message || 'Failed to send reset email.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* Header - Institutional Navy */}
        <div className="bg-[#002554] text-white p-5 sm:p-6 flex items-center justify-between border-b border-[#001c40]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>CSCA by Apply for China</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {currentUser 
                  ? (isZh ? '考生考籍档案与云端数据库' : 'Candidate Cloud Profile') 
                  : (isZh ? '登录考生账号' : 'Sign In')}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {currentUser ? (
            /* If already signed in: Profile & Sync Status */
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0056D2] uppercase tracking-wider">
                    {isZh ? '当前登录考生' : 'Logged-In Candidate'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Firestore Connected</span>
                  </span>
                </div>

                <div className="font-bold text-slate-900 text-base">
                  {currentUser.displayName || userProgress.candidateName || 'CSC Scholar'}
                </div>
                <div className="text-xs text-slate-600 font-mono">
                  {currentUser.email}
                </div>

                <div className="pt-2 border-t border-blue-200/60 grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div>
                    <span className="text-slate-400">{isZh ? '考号: ' : 'ID: '}</span>
                    <strong className="font-mono">{userProgress.candidateId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">{isZh ? '专属错题: ' : 'Errors: '}</span>
                    <strong>{userProgress.mistakeBook.filter(m => !m.resolved).length} Qs</strong>
                  </div>
                </div>
              </div>

              {/* Firestore Cloud Features Callout */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#0056D2]" />
                  <span>{isZh ? 'Google Cloud Firestore 隔离存储' : 'Cloud Firestore Isolated Storage'}</span>
                </div>
                <p>
                  {isZh 
                    ? '您的 20 套全真试卷做题记录、答卷答案、100分制得分以及个人专属错题本均已隔离保存在云端 Firestore 个人数据库中。' 
                    : 'Your past paper submissions and personal mistake notebook are securely isolated and synced to Cloud Firestore.'}
                </p>
              </div>

              {successMsg && (
                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0056D2]" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                onClick={handleSignOut}
                disabled={loading}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-300"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isZh ? '退出当前账号' : 'Sign Out'}</span>
              </button>
            </div>
          ) : (
            /* Clean Sign In */
            <div className="space-y-4">
              {/* Error Banner */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success Banner */}
              {successMsg && (
                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0056D2]" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:border-[#0056D2]"
                  />
                </div>

                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:border-[#0056D2]"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-0.5">
                  <input
                    id="modal-remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0056D2] border-slate-300 focus:ring-[#0056D2] cursor-pointer"
                  />
                  <label htmlFor="modal-remember-me" className="text-xs font-medium text-slate-700 cursor-pointer">
                    {isZh ? '记住我' : 'Remember me'}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#0056D2] hover:bg-[#0047b3] text-white rounded-lg text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span>{loading ? (isZh ? '正在验证...' : 'Signing in...') : (isZh ? '登录' : 'Sign in')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-lg text-sm font-medium flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{isZh ? '使用 Google 账号登录' : 'Sign in with Google'}</span>
                </button>

                <div className="pt-1 text-left">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setShowForgot(true);
                    }}
                    className="text-xs text-[#0056D2] hover:underline font-medium cursor-pointer"
                  >
                    {isZh ? '忘记密码？' : 'Forgotten your password?'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Forgot password inline modal */}
        {showForgot && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">{isZh ? '找回密码' : 'Password Reset'}</span>
              <button onClick={() => setShowForgot(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>
            {forgotMsg && <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded">{forgotMsg}</div>}
            {forgotError && <div className="text-xs text-rose-700 bg-rose-50 p-2 rounded">{forgotError}</div>}
            <form onSubmit={handlePasswordReset} className="flex gap-2">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Email"
                required
                className="flex-1 px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
              />
              <button
                type="submit"
                disabled={forgotLoading}
                className="px-3 py-1.5 bg-[#0056D2] text-white text-xs font-bold rounded cursor-pointer disabled:opacity-60"
              >
                {forgotLoading ? '...' : (isZh ? '发送' : 'Send')}
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#0056D2]" />
            <span>Google Cloud Firestore</span>
          </div>

          <div className="text-[11px] text-slate-400">
            {isZh ? '考生数据专属隔离' : 'Private & Isolated'}
          </div>
        </div>
      </div>
    </div>
  );
};
