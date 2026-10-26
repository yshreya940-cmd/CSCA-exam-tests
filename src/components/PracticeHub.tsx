import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  CheckCircle2, 
  Award, 
  Flame, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  ChevronRight,
  Zap,
  Target,
  FileCheck,
  Check,
  ShieldCheck,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { Subject, Language, UserProgress, QuizMode } from '../types/csca';
import { OFFICIAL_SYLLABI } from '../data/syllabusData';
import { User as FirebaseUser } from 'firebase/auth';
import { 
  signInOrAutoRegister, 
  loginWithGoogle, 
  resetUserPassword, 
  logoutUser,
  syncUserProfileToFirestore 
} from '../lib/firebase';

interface PracticeHubProps {
  onStartQuiz: (
    mode: QuizMode, 
    subject: Subject | 'All', 
    options?: { count?: number; timeLimit?: number; moduleTitle?: string; paperId?: string; examPaper?: string }
  ) => void;
  onNavigate: (tab: string) => void;
  lang: Language;
  userProgress: UserProgress;
  currentUser?: FirebaseUser | null;
  onUserLogin?: (user: FirebaseUser) => void;
  onUserLogout?: () => void;
  onOpenAuthModal?: () => void;
}

export const PracticeHub: React.FC<PracticeHubProps> = ({
  onStartQuiz,
  onNavigate,
  lang,
  userProgress,
  currentUser,
  onUserLogin,
  onUserLogout,
  onOpenAuthModal,
}) => {
  const isZh = lang === 'zh';
  const subjects: Subject[] = ['Mathematics', 'Physics', 'Chemistry', 'Chinese'];

  // Front-page sign-in states
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem('csca_remember_email') || '';
    } catch {
      return '';
    }
  });
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Forgot password modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const handleFrontPageSignIn = async (e: React.FormEvent) => {
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
      if (rememberMe) {
        try {
          localStorage.setItem('csca_remember_email', cleanEmail);
        } catch {}
      } else {
        try {
          localStorage.removeItem('csca_remember_email');
        } catch {}
      }

      const user = await signInOrAutoRegister(cleanEmail, password);
      if (onUserLogin) {
        onUserLogin(user);
      }
      setSuccessMsg(isZh ? '登录成功！已载入个人专属档案与错题本。' : 'Signed in! Loaded your personal notebook.');
      setPassword('');
    } catch (err: any) {
      let msg = err.message || 'Authentication failed.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = isZh ? '邮箱或密码不正确，请重新输入。' : 'Invalid email or password.';
      } else if (err.code === 'auth/weak-password') {
        msg = isZh ? '密码强度过低，请输入至少 6 个字符。' : 'Weak password. Use at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = isZh ? '请输入有效的邮箱地址。' : 'Invalid email format.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = isZh ? '邮箱登录服务未启用，请使用下方 Google 快速登录。' : 'Email sign-in is not enabled. Please sign in with Google below.';
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFrontPageGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      if (!user) {
        // User closed or dismissed Google popup window
        return;
      }
      if (onUserLogin) {
        onUserLogin(user);
      }
      await syncUserProfileToFirestore(user.uid, {
        ...userProgress,
        candidateEmail: user.email || '',
        candidateName: user.displayName || 'CSC Scholar',
      });
      setSuccessMsg(isZh ? 'Google 账号验证成功！' : 'Signed in with Google!');
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') {
        setErrorMsg(isZh ? '弹出窗口被浏览器拦截，请允许弹出窗口或使用邮箱登录。' : 'Popup blocked by browser. Please allow popups or use email sign in.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setErrorMsg(isZh ? '当前域名未配置在授权列表中，请使用上方邮箱密码直接登录。' : 'Domain not authorized in Firebase. Please sign in with email and password above.');
      } else if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setErrorMsg(err.message || 'Google Sign-in failed. Please use email sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFrontPageSignOut = async () => {
    try {
      await logoutUser();
      if (onUserLogout) {
        onUserLogout();
      }
    } catch (e: any) {
      console.error('Sign out error:', e);
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
      setForgotMsg(
        isZh 
          ? '密码重置邮件已发送！请查看您的收件箱。' 
          : 'Password reset email sent! Please check your inbox.'
      );
    } catch (err: any) {
      setForgotError(err.message || 'Failed to send password reset email.');
    } finally {
      setForgotLoading(false);
    }
  };

  const accuracy = userProgress.totalQuestionsAttempted > 0
    ? Math.round((userProgress.totalCorrect / userProgress.totalQuestionsAttempted) * 100)
    : 0;

  // Use user-attached assets directly from public/assets/aistudio/
  const subjectImages: Record<Subject, string> = {
    'Mathematics': '/assets/aistudio/Math_3a4ac7b4.png',
    'Physics': '/assets/aistudio/Physics_1609e2a6.png',
    'Chemistry': '/assets/aistudio/Chemistry_86d1ccaa.png',
    'Chinese': '/assets/aistudio/Cheese_11a71c53.png',
    'Professional Chinese': '/assets/aistudio/Cheese_11a71c53.png',
    'Science Chinese': '/assets/aistudio/Cheese_11a71c53.png',
    'Humanities Chinese': '/assets/aistudio/Cheese_11a71c53.png',
  };

  const subjectMetadata: Record<Subject, {
    titleZh: string;
    skillsEn: string;
    skillsZh: string;
    rating: string;
    reviews: string;
    levelEn: string;
    levelZh: string;
  }> = {
    'Mathematics': {
      titleZh: '高等数学与微积分基础',
      skillsEn: 'Limits, Derivatives, Integrals, Analytical Geometry & Linear Algebra',
      skillsZh: '函数极限、微积分推导、解析几何、向量空间与代数运算',
      rating: '4.9',
      reviews: '3,840',
      levelEn: 'Undergraduate Entrance · Mandatory for STEM & Economics',
      levelZh: '本科入学核心科目 · 理工经管类必考',
    },
    'Physics': {
      titleZh: '大学普通物理学',
      skillsEn: 'Newtonian Mechanics, Thermodynamics, Electromagnetism, Optics',
      skillsZh: '牛顿力学动力学、热力学与分子运动、电磁场论、几何光学与近代物理',
      rating: '4.8',
      reviews: '2,420',
      levelEn: 'Undergraduate Entrance · Mandatory for Engineering',
      levelZh: '本科入学选考科目 · 理工工程类推荐',
    },
    'Chemistry': {
      titleZh: '普通化学与有机分子',
      skillsEn: 'Chemical Kinetics, Equilibrium, Acid-Base, Organic Functional Groups',
      skillsZh: '化学动力学与平衡态、酸碱质子理论、电化学反应、典型有机官能团与合成',
      rating: '4.8',
      reviews: '1,960',
      levelEn: 'Undergraduate Entrance · Mandatory for Medicine, Chem & Bio',
      levelZh: '本科入学选考科目 · 医化生农类必考',
    },
    'Chinese': {
      titleZh: '中文水平测试',
      skillsEn: 'Academic Vocabulary, Scientific Passages, Structured Synthesis',
      skillsZh: '学术词汇理解、说明文深度阅读、长句语法结构、学术论述归纳',
      rating: '4.9',
      reviews: '4,150',
      levelEn: 'Undergraduate Entrance · Mandatory for All International Scholars',
      levelZh: '本科入学通用科目 · 所有全日制来华本科留学生必考',
    },
    'Professional Chinese': {
      titleZh: '中文水平测试',
      skillsEn: 'Academic Vocabulary, Scientific Passages, Structured Synthesis',
      skillsZh: '学术词汇理解、说明文深度阅读、长句语法结构、学术论述归纳',
      rating: '4.9',
      reviews: '4,150',
      levelEn: 'Undergraduate Entrance · Mandatory for All International Scholars',
      levelZh: '本科入学通用科目 · 所有全日制来华本科留学生必考',
    },
    'Science Chinese': {
      titleZh: '理科中文专业水平测试',
      skillsEn: 'STEM Vocabulary, Lab Data Interpretation, Technical Passages',
      skillsZh: '理工专业术语、数理符号中文化表达、科技说明文深度阅读与逻辑分析',
      rating: '4.8',
      reviews: '1,520',
      levelEn: 'Undergraduate Entrance · Sciences Track Mandatory',
      levelZh: '本科入学考试科目 · 理工科专业必考',
    },
    'Humanities Chinese': {
      titleZh: '文科中文专业水平测试',
      skillsEn: 'Humanities & Social Sciences Terminology, Academic Writing & Reading',
      skillsZh: '人文社科专业词汇、学术论著长篇阅读、文化背景理解与学术论述',
      rating: '4.9',
      reviews: '1,830',
      levelEn: 'Undergraduate Entrance · Humanities Track Mandatory',
      levelZh: '本科入学考试科目 · 文科经管类必考',
    },
  };

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-20">
      {/* 1. APPLY FOR CHINA OFFICIAL HERO BANNER - Blue Theme Signature Design */}
      <section className="w-full bg-gradient-to-r from-[#031538] via-[#092357] to-[#04163d] text-white relative overflow-hidden shadow-lg border-b border-blue-950">
        {/* Subtle Background Image with right-aligned fade */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 pointer-events-none overflow-hidden">
          <img
            src="/assets/aistudio/Banner_c102f395.png"
            alt="Study in China Background"
            className="w-full h-full object-cover object-right opacity-30 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#031538] via-[#092357]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#031538] via-transparent to-[#031538]/50"></div>
        </div>

        <div className="relative px-4 sm:px-8 lg:px-12 py-10 sm:py-14 max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10">
          {/* Left Column: Core Headline and Action Buttons */}
          <div className="flex-1 max-w-2xl space-y-6">
            {/* Top Blue Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-sky-400/40 bg-sky-950/60 text-sky-300 font-mono text-xs font-semibold tracking-widest uppercase rounded-sm">
              <span className="w-2 h-2 bg-sky-400 rounded-full inline-block animate-pulse"></span>
              <span>2026 APPLICATIONS ARE OPEN</span>
            </div>

            {/* Core Distinctive Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] font-sans">
                <span className="block font-black text-white">Your clearest path to</span>
                <span className="block italic font-serif text-sky-300 font-normal">studying in China.</span>
              </h1>
            </div>

            {/* Subtitle Description */}
            <p className="text-sm sm:text-base text-blue-100 font-light leading-relaxed">
              {isZh 
                ? '选对目标学府、打造权威高分申请材料，并由专家团队全程护航直至顺利入学。权威 CSCA 历年官方真题库与全真机考模拟。' 
                : 'Find the right university, build a stronger application, and arrive with one expert team beside you. Complete CSCA past papers & CBT simulation.'}
            </p>

            {/* Action Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('mock')}
                className="px-5 py-3 border border-sky-300/40 text-white font-semibold rounded-md text-sm hover:bg-white/10 transition-colors cursor-pointer active:scale-98"
              >
                <span>Explore services</span>
              </button>

              <button
                onClick={() => onNavigate('mock')}
                className="px-6 py-3 bg-[#0056D2] hover:bg-blue-600 text-white font-semibold rounded-md text-sm shadow-md shadow-blue-950/50 flex items-center gap-2 transition-colors cursor-pointer active:scale-98"
              >
                <Award className="w-4 h-4 text-sky-200" />
                <span>{isZh ? '进入历年真题库 (20套)' : 'Official Past Papers (20 Sets)'}</span>
              </button>

              <button
                onClick={() => onStartQuiz('daily', 'All', { count: 10, timeLimit: 900 })}
                className="px-4 py-3 bg-blue-900/60 hover:bg-blue-800/80 text-blue-100 border border-blue-400/30 font-medium rounded-md text-sm flex items-center gap-1.5 transition-colors cursor-pointer active:scale-98"
              >
                <Zap className="w-4 h-4 text-sky-300 fill-sky-300" />
                <span>{isZh ? '每日速练' : 'Daily Drill'}</span>
              </button>

              {/* Circular Video Play Button */}
              <div 
                onClick={() => onNavigate('mock')}
                className="w-11 h-11 rounded-full bg-blue-950/80 hover:bg-blue-900 border border-blue-400/40 flex items-center justify-center text-sky-200 hover:text-white transition cursor-pointer shadow-sm"
                title="Preview Examination Guide"
              >
                <Play className="w-4 h-4 fill-current ml-0.5 text-sky-300" />
              </div>
            </div>

            {/* Social Proof Avatars & Tag */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3 text-xs text-blue-100">
                <div className="flex -space-x-2">
                  <span className="w-7 h-7 rounded-full bg-blue-700 border-2 border-[#031538] flex items-center justify-center text-[10px] font-bold text-white">MK</span>
                  <span className="w-7 h-7 rounded-full bg-sky-700 border-2 border-[#031538] flex items-center justify-center text-[10px] font-bold text-white">AR</span>
                  <span className="w-7 h-7 rounded-full bg-indigo-700 border-2 border-[#031538] flex items-center justify-center text-[10px] font-bold text-white">JL</span>
                  <span className="w-7 h-7 rounded-full bg-blue-600 border-2 border-[#031538] flex items-center justify-center text-[10px] font-bold text-white">SN</span>
                </div>
                <div>
                  <span className="font-bold text-white font-mono">4.9 / 5</span>
                  <span className="text-blue-200/80 ml-1.5">from students in 70+ countries</span>
                </div>
              </div>

              <div className="hidden sm:inline-flex items-center px-4 py-2 bg-white text-blue-950 font-bold text-[11px] uppercase tracking-widest rounded-sm shadow-md">
                STUDY · LIVE · GROW
              </div>
            </div>
          </div>

          {/* Right Column: Direct Front-Page Sign-In Card (Matching user screenshot) */}
          <div className="w-full lg:w-[380px] xl:w-[400px] flex-shrink-0">
            {currentUser ? (
              /* Signed-in Candidate Card */
              <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-blue-900/40 text-slate-900 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-[#0056D2] uppercase tracking-wider">
                      {isZh ? '考生考籍已连接' : 'Candidate Connected'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-50 text-[#0056D2] px-2 py-0.5 rounded font-semibold border border-blue-200">
                    Firestore Active
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {currentUser.displayName || userProgress.candidateName || 'CSC Candidate'}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono truncate">
                    {currentUser.email}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-400 font-medium">{isZh ? '专属考号' : 'Candidate ID'}</div>
                    <div className="font-mono font-bold text-slate-800 text-xs mt-0.5 truncate">
                      {userProgress.candidateId}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                    <div className="text-[10px] text-rose-600 font-medium">{isZh ? '专属错题' : 'Private Errors'}</div>
                    <div className="font-bold text-rose-700 text-xs mt-0.5">
                      {userProgress.mistakeBook.filter(m => !m.resolved).length} {isZh ? '道题' : 'missed'}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => onNavigate('mistakes')}
                    className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{isZh ? '进入专属错题本' : 'Open My Mistake Notebook'}</span>
                  </button>

                  <button
                    onClick={() => onNavigate('mock')}
                    className="w-full py-2.5 px-4 bg-[#0056D2] hover:bg-[#00419e] text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>{isZh ? '开始真题原卷模考' : 'Start Real Exam Paper'}</span>
                  </button>

                  <button
                    onClick={handleFrontPageSignOut}
                    className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isZh ? '退出账号' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Clean Front-Page Sign-In Card (Strictly without 'create an account' as requested) */
              <div className="bg-white rounded-2xl p-7 sm:p-8 shadow-2xl border border-blue-900/30 text-slate-900 space-y-4 relative">
                {/* Header: Sign in */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Sign in
                  </h2>
                </div>

                {/* Feedback Alerts */}
                {errorMsg && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span className="leading-tight">{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-2.5 bg-blue-50 border border-blue-200 text-[#0056D2] rounded-lg text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0056D2] flex-shrink-0" />
                    <span className="leading-tight">{successMsg}</span>
                  </div>
                )}

                {/* Form Elements */}
                <form onSubmit={handleFrontPageSignIn} className="space-y-3.5">
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
                      id="front-remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0056D2] border-slate-300 focus:ring-[#0056D2] cursor-pointer"
                    />
                    <label 
                      htmlFor="front-remember-me"
                      className="text-xs font-medium text-slate-700 select-none cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>

                  {/* Solid Blue Primary Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-[#0056D2] hover:bg-[#0047b3] active:bg-[#003d99] text-white rounded-lg text-sm font-semibold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <span>{loading ? 'Signing in...' : 'Sign in'}</span>
                  </button>

                  {/* Secondary Sign in with Google Button with official Google 'G' icon */}
                  <button
                    type="button"
                    onClick={handleFrontPageGoogleSignIn}
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-sm font-medium flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>

                  {/* Forgotten your password? link */}
                  <div className="pt-1 text-left">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setShowForgotModal(true);
                      }}
                      className="text-xs text-[#0056D2] hover:text-[#00419e] hover:underline font-medium cursor-pointer transition-colors"
                    >
                      Forgotten your password?
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Diamond Ticker Strip */}
        <div className="w-full bg-[#020b1c] border-t border-blue-900/60 py-2.5 px-4 sm:px-8 flex items-center justify-between overflow-x-auto text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-blue-200 whitespace-nowrap gap-4">
          <span>PARTNER UNIVERSITIES</span>
          <span className="text-sky-400">◆</span>
          <span>SCHOLARSHIP GUIDANCE</span>
          <span className="text-sky-400">◆</span>
          <span>VISA & ARRIVAL SUPPORT</span>
          <span className="text-sky-400">◆</span>
          <span>4,000+ STUDY PROGRAMS</span>
          <span className="text-sky-400">◆</span>
          <span>100+ PARTNER UNIVERSITIES</span>
        </div>
      </section>

      {/* Candidate Learning KPI Bar - Clean and Uncluttered */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-2xs hover:border-blue-200 transition-colors">
            <div className="text-xs text-slate-500 font-medium">{isZh ? '累计做题' : 'Questions Practiced'}</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
              {userProgress.totalQuestionsAttempted}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-2xs hover:border-blue-200 transition-colors">
            <div className="text-xs text-slate-500 font-medium">{isZh ? '平均正确率' : 'Accuracy'}</div>
            <div className="text-2xl font-bold text-[#0056D2] mt-1 font-mono">
              {accuracy}%
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-2xs hover:border-blue-200 transition-colors">
            <div className="text-xs text-slate-500 font-medium">{isZh ? '完成模考' : 'Completed Exams'}</div>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
              {userProgress.sessionsHistory.filter(s => s.isCompleted).length}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-2xs hover:border-blue-200 transition-colors">
            <div className="text-xs text-slate-500 font-medium">{isZh ? '连续备考' : 'Study Streak'}</div>
            <div className="text-2xl font-bold text-[#0056D2] flex items-center gap-1.5 mt-1 font-mono">
              <Flame className="w-5 h-5 text-blue-500 fill-blue-500" />
              <span>{userProgress.streakDays} {isZh ? '天' : 'days'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SUBJECT CARDS SECTION - Full Width */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {isZh ? '官方考核科目专项课程' : 'CSCA Subjects & Modules'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {isZh 
                ? '包含历年官方真题、章节大纲考点、中英双语解析与全真机考模拟' 
                : 'Official past papers, syllabus breakdown, bilingual step-by-step derivations, and CBT simulation.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('syllabus')}
            className="text-xs sm:text-sm font-semibold text-[#0056D2] hover:text-[#00419e] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>{isZh ? '查看 2025 官方考试大纲' : 'View All Syllabi'}</span>
            <ChevronRight className="w-4 h-4 text-[#0056D2]" />
          </button>
        </div>

        {/* 4 Prominent Subject Cards - Clean, Uncluttered, Easy to Read */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {subjects.map((subj) => {
            const syllabus = OFFICIAL_SYLLABI[subj];
            const meta = subjectMetadata[subj];
            const cardImg = subjectImages[subj];
            const stats = userProgress.subjectStats[subj] || { attempted: 0, correct: 0, highestScore: 0, testsTaken: 0 };

            return (
              <div
                key={subj}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#0056D2] hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Course Image */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                  <img
                    src={cardImg}
                    alt={subj}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>

                  <div className="absolute bottom-3.5 left-4 right-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-xs">
                      {subj}
                    </h3>
                    <div className="text-xs text-blue-100 font-medium mt-0.5">
                      {meta.titleZh}
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* Quiet metadata line */}
                    <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                      <span>{syllabus.code}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{syllabus.totalQuestions} {isZh ? '道考题' : 'Questions'}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{syllabus.durationMinutes} {isZh ? '分钟' : 'Minutes'}</span>
                    </div>

                    {/* Key Focus / Topics in calm, readable typography */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {isZh ? meta.skillsZh : meta.skillsEn}
                    </p>
                  </div>

                  {/* Actions & Simple History */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <div className="text-xs text-slate-500">
                      {stats.testsTaken > 0 ? (
                        <span>
                          {isZh ? '最佳: ' : 'Best: '} 
                          <strong className="text-[#0056D2] font-bold">{stats.highestScore}/100</strong>
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          {isZh ? '全真原卷原序' : 'Fact Question Order'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onStartQuiz('topic', subj, { count: 5 })}
                        className="py-2.5 px-3.5 bg-blue-50 hover:bg-blue-100 text-[#0056D2] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {isZh ? '5题练习' : 'Quick Drill'}
                      </button>

                      <button
                        onClick={() => {
                          const paperIdMap: Record<string, string> = {
                            Mathematics: 'math-jan-2026',
                            Physics: 'phys-jan-2026',
                            Chemistry: 'chem-jan-2026',
                            Chinese: 'scichin-jan-2026',
                            'Science Chinese': 'scichin-jan-2026',
                            'Humanities Chinese': 'humchin-jan-2026',
                            'Professional Chinese': 'scichin-jan-2026',
                          };
                          onStartQuiz('past_paper', subj, { 
                            paperId: paperIdMap[subj] || 'math-jan-2026',
                            count: syllabus.totalQuestions, 
                            timeLimit: syllabus.durationMinutes * 60 
                          });
                        }}
                        className="py-2.5 px-4 bg-[#0056D2] hover:bg-[#00419e] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-98"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{isZh ? '开始真题原卷模考' : 'Start Real Exam'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. WHY CSCA BY APPLY FOR CHINA (VALUE PROPOSITIONS) - Full Width */}
      <section className="w-full bg-white py-10 sm:py-12 px-4 sm:px-8 lg:px-12 xl:px-16 border-y border-slate-200 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {isZh ? '为什么选择 CSCA by Apply for China 备考平台？' : 'Why Prepare with CSCA by Apply for China'}
          </h2>
          <p className="text-sm text-slate-500">
            {isZh 
              ? '专门针对中国政府奖学金 (CSC) 申请者与来华留学本科生打造的官方对标平台' 
              : 'Engineered specifically for China Scholarship Council applicants and international scholars.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="w-10 h-10 rounded-md bg-blue-50 text-[#0056D2] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {isZh ? '100% 真实考题与原序' : 'Verbatim Paper Fidelity'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isZh 
                ? '题目与选项与官方试卷完全一致，严格保持 1 到 80 题原始出题顺序，绝无乱序打乱。' 
                : 'Questions and options are 100% identical to the official exam booklets in factual 1..80 order.'}
            </p>
          </div>

          <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="w-10 h-10 rounded-md bg-blue-50 text-[#0056D2] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {isZh ? '真实机考 (CBT) 模拟考场' : 'Full CBT Simulator'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isZh 
                ? '60/90 分钟倒计时、答题卡题目导航、待复查标记与自动交卷核分机制。' 
                : '60/90-minute strict exam countdown, interactive answer sheet, flag-for-review, and instant score report.'}
            </p>
          </div>

          <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="w-10 h-10 rounded-md bg-blue-50 text-[#0056D2] flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {isZh ? '中英双语详尽解析' : 'Bilingual Explanations'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isZh 
                ? '每道题目均提供中文与英文双语对照解析，包含完整公式演算与解题突破口。' 
                : 'Every single question includes full English and Chinese explanations with step-by-step formula derivations.'}
            </p>
          </div>

          <div className="p-5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="w-10 h-10 rounded-md bg-blue-50 text-[#0056D2] flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {isZh ? '学情分析与错题专练' : 'Analytics & Mistake Notebook'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isZh 
                ? '自动收集历次模考错题，按科目与知识点分类归纳，支持一键针对性重练。' 
                : 'Automatically logs missed questions into your personal Mistake Notebook for targeted re-drills.'}
            </p>
          </div>
        </div>
      </section>

      {/* 4. LEARNING MODES GRID - Full Width */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isZh ? '多样化备考模式' : 'Flexible Learning Programs'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isZh ? '根据您的学习日程选择针对性训练' : 'Choose a training format matched to your schedule'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Daily 10 Qs */}
          <div 
            onClick={() => onStartQuiz('daily', 'All', { count: 10, timeLimit: 900 })}
            className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0056D2] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0056D2] flex items-center justify-center font-bold mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-medium text-slate-400 mb-1">
                {isZh ? '15 分钟速练' : '15 min drill'}
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0056D2] transition-colors">
                {isZh ? '每日速练 10 题' : 'Daily 10-Q Drill'}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {isZh ? '跨科目高频考题精选，快速激活做题状态。' : '10 mixed questions across all subjects for rapid warm-up.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-[#0056D2] gap-1">
              <span>{isZh ? '立即练习' : 'Start Drill'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Full Mock */}
          <div 
            onClick={() => onNavigate('mock')}
            className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0056D2] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0056D2] flex items-center justify-center font-bold mb-4">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-medium text-slate-400 mb-1">
                {isZh ? '60/90 分钟全真' : '60/90 min exam'}
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0056D2] transition-colors">
                {isZh ? '历年全真真题库' : 'Official Past Papers'}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {isZh ? '涵盖 20 套官方全真试卷，严格原卷题目顺序。' : '20 authentic papers in factual question order with real scoring.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-[#0056D2] gap-1">
              <span>{isZh ? '进入真题考场' : 'Open Exam Room'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* AI Generator */}
          <div 
            onClick={() => onNavigate('ai-tutor')}
            className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0056D2] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0056D2] flex items-center justify-center font-bold mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-medium text-slate-400 mb-1">
                {isZh ? '智能自适应' : 'Adaptive AI'}
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0056D2] transition-colors">
                {isZh ? 'AI 弱项出题与答疑' : 'AI Adaptive Tutor'}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {isZh ? '针对薄弱考点生成个性化练习，双语深度拆解。' : 'Targeted questions based on weak modules with AI guidance.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-[#0056D2] gap-1">
              <span>{isZh ? '体验智能辅导' : 'Open AI Tutor'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Mistake Notebook */}
          <div 
            onClick={() => onNavigate('mistakes')}
            className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0056D2] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0056D2] flex items-center justify-center font-bold mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-medium text-slate-400 mb-1">
                {userProgress.mistakeBook.filter(m => !m.resolved).length} {isZh ? '道待复习' : 'unresolved'}
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0056D2] transition-colors">
                {isZh ? '错题本与弱项消灭' : 'Mistake Notebook'}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {isZh ? '自动归纳历次错题，逐题击破盲区，考前重练。' : 'Targeted review and re-drills of previously missed questions.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-[#0056D2] gap-1">
              <span>{isZh ? '复习错题' : 'Review Missed'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. OFFICIAL CSC EXAMINATION SCHEDULE - Full Width */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pb-10">
        <div className="bg-white rounded-xl p-8 sm:p-10 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-md bg-blue-50 text-[#0056D2] flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
                  {isZh ? 'CSCA 2025-2026 官方考试指南与日程' : 'CSCA Official Examination Guidelines & Schedule'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isZh ? '国家留学基金委 (CSC) 来华留学全国统一标准' : 'China Scholarship Council National CBT Rules'}
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded text-xs font-bold bg-blue-50 text-[#0056D2] border border-blue-200 self-start sm:self-auto">
              {isZh ? '首考启动: 2025年12月21日' : 'Launch: Dec 21, 2025'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
            <div className="bg-slate-50/70 p-5 rounded-lg border border-slate-200 space-y-2.5">
              <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-[#0056D2]" />
                <span>{isZh ? '单日考试时间表 (UTC+8)' : 'Test Day Timetable (UTC+8)'}</span>
              </div>
              <ul className="space-y-1.5 text-slate-600">
                <li>• {isZh ? '中文' : 'Chinese'}: 13:00 - 14:30 (90 min, 80题)</li>
                <li>• {isZh ? '数学' : 'Mathematics'}: 15:30 - 16:30 (60 min, 48题)</li>
                <li>• {isZh ? '物理' : 'Physics'}: 17:30 - 18:30 (60 min, 48题)</li>
                <li>• {isZh ? '化学' : 'Chemistry'}: 19:30 - 20:30 (60 min, 48题)</li>
              </ul>
            </div>

            <div className="bg-slate-50/70 p-5 rounded-lg border border-slate-200 space-y-2.5">
              <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-[#0056D2]" />
                <span>{isZh ? '每年考试频次与形式' : 'Annual Sessions & Format'}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {isZh 
                  ? '每年常态化开展 5 次考试（1月、3月、4月、6月、12月），采用居家远程在线机考 (CBT) 形式，双机位监考。'
                  : '5 sessions annually (Jan, Mar, Apr, Jun, Dec). Conducted primarily via remote online CBT with dual-camera proctoring.'}
              </p>
            </div>

            <div className="bg-slate-50/70 p-5 rounded-lg border border-slate-200 space-y-2.5">
              <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <FileCheck className="w-4 h-4 text-[#0056D2]" />
                <span>{isZh ? '中国政府奖学金要求与费用' : 'Scholarship Requirements'}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {isZh 
                  ? '中国政府奖学金 (CGS) 必考：数学与中文；理工农医类选考物理、化学。单科 450 元，两科及以上 700 元。'
                  : 'CGS Mandatory: Mathematics & Chinese. Science/Engineering: Physics, Chemistry. 450 CNY for 1 subject, 700 CNY for 2+.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
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
              <div className="p-3 bg-blue-50 border border-blue-200 text-[#0056D2] rounded-xl text-xs">
                {forgotMsg}
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0056D2]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotMsg(null);
                    setForgotError(null);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {isZh ? '取消' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 py-1.5 bg-[#0056D2] hover:bg-[#0047b3] text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {forgotLoading ? (isZh ? '发送中...' : 'Sending...') : (isZh ? '发送重置邮件' : 'Send Link')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

