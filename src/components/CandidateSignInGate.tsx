import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  ArrowRight,
  RotateCcw,
  Check
} from 'lucide-react';
import { 
  signInOrAutoRegister, 
  loginWithGoogle, 
  resetUserPassword,
  syncUserProfileToFirestore 
} from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import { Language, UserProgress } from '../types/csca';
import { CscaLogo } from './CscaLogo';

interface CandidateSignInGateProps {
  lang: Language;
  onToggleLang: () => void;
  userProgress: UserProgress;
  onUserLogin: (user: FirebaseUser) => void;
}

export const CandidateSignInGate: React.FC<CandidateSignInGateProps> = ({
  lang,
  onToggleLang,
  userProgress,
  onUserLogin,
}) => {
  const isZh = lang === 'zh';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

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
      setSuccessMsg(isZh ? '登录成功！正在进入 CSCA 备考主页...' : 'Signed in! Entering CSCA Practice Portal...');
      setTimeout(() => onUserLogin(user), 500);
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = isZh ? '邮箱或密码不正确，请重新输入。' : 'Invalid email or password. Please verify your credentials.';
      } else if (err.code === 'auth/weak-password') {
        msg = isZh ? '密码强度过低，请输入至少 6 个字符。' : 'Weak password. Use at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = isZh ? '请输入有效的电子邮箱地址。' : 'Invalid email address.';
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
      await syncUserProfileToFirestore(user.uid, {
        ...userProgress,
        candidateEmail: user.email || '',
        candidateName: user.displayName || 'CSC Scholar',
      });
      setSuccessMsg(isZh ? 'Google 账号验证成功！正在进入考场主页...' : 'Signed in with Google! Entering portal...');
      setTimeout(() => onUserLogin(user), 500);
    } catch (err: any) {
      console.error('Google auth error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || 'Google Sign-in failed.');
      }
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
      setForgotError(isZh ? '请输入您的注册邮箱' : 'Please enter your email address.');
      return;
    }

    setForgotLoading(true);
    try {
      await resetUserPassword(clean);
      setForgotMsg(
        isZh 
          ? '密码重置邮件已发送！请查看您的邮箱收件箱。' 
          : 'Password reset email sent! Please check your inbox.'
      );
    } catch (err: any) {
      console.error('Reset error:', err);
      setForgotError(err.message || 'Failed to send password reset email.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans">
      {/* Top Institutional Navy Header */}
      <header className="bg-[#002554] text-white border-b border-[#001c40] px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <CscaLogo size="sm" />
            <div className="flex items-baseline space-x-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                CSCA
              </span>
              <span className="text-blue-400 font-light text-lg">|</span>
              <span className="text-xs sm:text-sm font-bold tracking-tight text-blue-200 leading-none">
                by Apply for China
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#001c40] border border-blue-400/30 text-[11px] text-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
              <span>{isZh ? '国家留学基金委 (CSC) 规范机考' : 'CSC CBT Standard'}</span>
            </div>

            <button
              onClick={onToggleLang}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#001c40] hover:bg-[#003366] text-blue-100 border border-blue-400/40 text-xs transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-sky-300" />
              <span className="font-semibold">{isZh ? 'English' : '中文'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Gate Hero & Focused Sign-In Card */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
        {/* Left Column: Authority & Access Introduction */}
        <div className="w-full lg:w-1/2 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-blue-300 bg-blue-50 text-[#0056D2] font-mono text-xs font-bold tracking-wider uppercase rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#0056D2] animate-pulse"></span>
            <span>{isZh ? '2026 官方申请季 · 考生身份核验' : '2026 CSCA CANDIDATE PORTAL'}</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {isZh ? '请先登录您的考生账号' : 'Sign in to access your'}
              <span className="block text-[#0056D2]">
                {isZh ? '进入 CSCA 备考主页与考场' : 'CSCA Examination Hub'}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              {isZh
                ? '为了保障机考真实性并自动将历次模考答卷、100分制得分与专属错题本严格加密隔离存储至您的个人云端档案，请直接在右侧登录。'
                : 'To ensure accurate CBT simulation, timed auto-submission, and private cloud storage of your past paper scores and personal mistake notebook, please sign in.'}
            </p>
          </div>

          {/* 3 Key Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <Award className="w-5 h-5 text-[#0056D2] mb-1.5" />
              <div className="font-bold text-xs text-slate-900">{isZh ? '20套全真真题' : '20 Past Papers'}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{isZh ? '物理·化学·数学·中文' : 'Dec 2025 – Apr 2026'}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <Clock className="w-5 h-5 text-[#0056D2] mb-1.5" />
              <div className="font-bold text-xs text-slate-900">{isZh ? '全真机考模拟' : 'CBT Simulator'}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{isZh ? '倒计时与答题卡' : '60/90m Timed CBT'}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-[#0056D2] mb-1.5" />
              <div className="font-bold text-xs text-slate-900">{isZh ? '专属错题隔离' : 'Private Notebook'}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{isZh ? '每位考生独立' : 'Isolated User Data'}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Sign In Card - Directly matching user requested example */}
        <div className="w-full lg:w-[420px]">
          <div className="bg-white rounded-2xl p-7 sm:p-9 border border-slate-200 shadow-xl relative">
            {/* Header: Sign in */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {isZh ? '登录' : 'Sign in'}
              </h2>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span className="leading-tight">{errorMsg}</span>
              </div>
            )}

            {/* Success Banner */}
            {successMsg && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-[#0056D2] rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0056D2] flex-shrink-0" />
                <span className="leading-tight">{successMsg}</span>
              </div>
            )}

            {/* Clean Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:border-[#0056D2] transition-colors"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:border-[#0056D2] transition-colors"
                />
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center space-x-2 pt-0.5">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0056D2] border-slate-300 focus:ring-[#0056D2] cursor-pointer"
                />
                <label 
                  htmlFor="remember-me"
                  className="text-xs font-medium text-slate-700 select-none cursor-pointer"
                >
                  {isZh ? '记住我' : 'Remember me'}
                </label>
              </div>

              {/* Primary Sign In Button (Solid Blue) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#0056D2] hover:bg-[#0047b3] active:bg-[#003d99] text-white rounded-lg text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span>
                  {loading 
                    ? (isZh ? '正在验证...' : 'Signing in...') 
                    : (isZh ? '登录' : 'Sign in')}
                </span>
              </button>

              {/* Secondary Sign In with Google Button (White with Google 'G' logo) */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-sm font-medium flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isZh ? '使用 Google 账号登录' : 'Sign in with Google'}</span>
              </button>

              {/* Forgotten your password link */}
              <div className="pt-2 text-left">
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="text-xs text-[#0056D2] hover:text-[#00419e] hover:underline font-medium cursor-pointer transition-colors"
                >
                  {isZh ? '忘记密码？' : 'Forgotten your password?'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isZh ? '找回密码' : 'Reset Password'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isZh 
                  ? '输入您的考生注册邮箱，我们将向您发送重置密码链接。' 
                  : 'Enter your registered email and we will send you a reset link.'}
              </p>
            </div>

            {forgotError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
                {forgotError}
              </div>
            )}

            {forgotMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs">
                {forgotMsg}
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-3">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0056D2]"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotMsg(null);
                    setForgotError(null);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {isZh ? '取消' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 py-1.5 rounded-lg bg-[#0056D2] hover:bg-[#00419e] text-white text-xs font-semibold shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {forgotLoading 
                    ? (isZh ? '发送中...' : 'Sending...') 
                    : (isZh ? '发送重置链接' : 'Send Reset Link')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Institutional Footer */}
      <footer className="bg-[#002554] text-slate-300 text-xs py-6 border-t border-[#001c40]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-blue-200">
          <div>
            © 2026 CSCA by Apply for China & China Scholarship Council. All rights reserved.
          </div>
          <div>
            Physics · Mathematics · Chemistry · Chinese (80 Qs / 90 Min)
          </div>
        </div>
      </footer>
    </div>
  );
};
