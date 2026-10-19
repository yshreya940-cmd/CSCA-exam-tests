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
  ArrowUpRight,
  FileCheck
} from 'lucide-react';
import { Subject, Language, UserProgress, QuizMode } from '../types/csca';
import { OFFICIAL_SYLLABI } from '../data/syllabusData';

interface PracticeHubProps {
  lang: Language;
  userProgress: UserProgress;
  onStartQuiz: (mode: QuizMode, subject: Subject | 'All', options?: { moduleTitle?: string; count?: number; timeLimit?: number }) => void;
  onNavigate: (tab: string) => void;
}

export const PracticeHub: React.FC<PracticeHubProps> = ({
  lang,
  userProgress,
  onStartQuiz,
  onNavigate,
}) => {
  const isZh = lang === 'zh';

  const subjects: Subject[] = ['Mathematics', 'Physics', 'Chemistry', 'Professional Chinese'];

  const accuracy = userProgress.totalQuestionsAttempted > 0
    ? Math.round((userProgress.totalCorrect / userProgress.totalQuestionsAttempted) * 100)
    : 0;

  const subjectImages: Record<Subject, string> = {
    Mathematics: '/src/assets/images/math_card_banner_1791957939868.jpg',
    Physics: '/src/assets/images/physics_card_banner_1791957940677.jpg',
    Chemistry: '/src/assets/images/chemistry_card_banner_1791957942918.jpg',
    'Professional Chinese': '/src/assets/images/chinese_card_banner_1791957941308.jpg',
    'Science Chinese': '/src/assets/images/chinese_card_banner_1791957941308.jpg',
    'Humanities Chinese': '/src/assets/images/chinese_card_banner_1791957941308.jpg',
  };

  return (
    <div className="space-y-20 sm:space-y-24 pb-24">
      {/* SECTION 1: Spacious, Minimal Hero with Photo Showcase */}
      <section className="bg-gradient-to-br from-[#0c2340] via-[#10335e] to-[#18467b] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-400/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" />
              <span>CSC 2025 Edition Official Standard</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                CSCA
              </h1>
              <p className="text-lg sm:text-xl font-medium text-blue-100">
                {isZh ? '中国学术水平能力测试 · 备考中心' : 'China Scholastic Competency Assessment'}
              </p>
              <p className="text-sm text-slate-300 font-normal pt-1 max-w-lg leading-relaxed">
                {isZh 
                  ? '官方 2025 版大纲全真模考、章节刷题与学情追踪系统。'
                  : 'Official timed CBT mock exams, topic drills, and progress tracking.'}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onStartQuiz('daily', 'All', { count: 10, timeLimit: 900 })}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl text-sm shadow-md flex items-center gap-2 transition-all active:scale-95"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>{isZh ? '每日速练 10 题' : 'Daily 10-Q Practice'}</span>
              </button>

              <button
                onClick={() => onNavigate('mock')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl text-sm border border-white/20 flex items-center gap-2 transition-all"
              >
                <Award className="w-4 h-4 text-cyan-300" />
                <span>{isZh ? '全真模拟考' : 'Full Timed Mock'}</span>
              </button>
            </div>
          </div>

          {/* Right Image Showcase Card (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 group">
              <img
                src="/src/assets/images/hero_study_banner_1791957940822.jpg"
                alt="CSCA Study"
                className="w-full h-64 sm:h-72 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                <span className="font-semibold bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  {isZh ? '2025 重点高校留学生入学标准' : 'University Entrance Standard'}
                </span>
                <span className="text-amber-300 font-mono font-bold">2025 Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spacious KPI Metric Cards */}
        <div className="mt-10 pt-8 border-t border-blue-400/20 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="bg-black/20 rounded-2xl p-4 border border-white/10">
            <div className="text-xs text-blue-200">{isZh ? '累计做题' : 'Questions'}</div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {userProgress.totalQuestionsAttempted}
            </div>
          </div>

          <div className="bg-black/20 rounded-2xl p-4 border border-white/10">
            <div className="text-xs text-blue-200">{isZh ? '正确率' : 'Accuracy'}</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
              {accuracy}%
            </div>
          </div>

          <div className="bg-black/20 rounded-2xl p-4 border border-white/10">
            <div className="text-xs text-blue-200">{isZh ? '完成模考' : 'Mock Exams'}</div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {userProgress.sessionsHistory.filter(s => s.isCompleted).length}
            </div>
          </div>

          <div className="bg-black/20 rounded-2xl p-4 border border-white/10">
            <div className="text-xs text-blue-200">{isZh ? '连续备考' : 'Streak'}</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 flex items-center gap-1.5 mt-1">
              <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span>{userProgress.streakDays} {isZh ? '天' : 'd'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 4 Practice Modes (Clean, Airy & Scannable) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isZh ? '快速练习模式' : 'Practice Modes'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {isZh ? '选择适合您的备考节奏' : 'Select your training mode'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Daily 10 Qs */}
          <div 
            onClick={() => onStartQuiz('daily', 'All', { count: 10, timeLimit: 900 })}
            className="group cursor-pointer bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  15 min
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                {isZh ? '每日速练' : 'Daily 10-Q Drill'}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {isZh ? '10 道跨科目高频精选题，快速热身。' : '10 mixed questions across all subjects.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-amber-600 gap-1">
              <span>{isZh ? '开始速练' : 'Start Drill'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Full Mock */}
          <div 
            onClick={() => onNavigate('mock')}
            className="group cursor-pointer bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  60/90 min
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                {isZh ? '全真模拟考' : 'Full Timed Mock'}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {isZh ? '严格倒计时、答题卡与 100 分制计分。' : 'Official countdown, answer sheet, 100 pts.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600 gap-1">
              <span>{isZh ? '进入考场' : 'Enter Exam'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* AI Generator */}
          <div 
            onClick={() => onNavigate('ai-tutor')}
            className="group cursor-pointer bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  Gemini AI
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-purple-600 transition-colors">
                {isZh ? 'AI 弱项出题' : 'AI Adaptive Tutor'}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {isZh ? '针对薄弱考点自适应生成练习与名师解析。' : 'Targeted questions on weak modules.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-purple-600 gap-1">
              <span>{isZh ? '智能生成' : 'Explore AI'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Mistake Notebook */}
          <div 
            onClick={() => onNavigate('mistakes')}
            className="group cursor-pointer bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  {userProgress.mistakeBook.filter(m => !m.resolved).length} {isZh ? '题' : 'Items'}
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-rose-600 transition-colors">
                {isZh ? '错题本' : 'Mistake Notebook'}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {isZh ? '集中重做历次做错题目，攻克薄弱盲区。' : 'Review and retake missed questions.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-rose-600 gap-1">
              <span>{isZh ? '查看错题' : 'Review Mistakes'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Visual Subject Cards (Spacious, Image-Driven, Non-Wordy) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isZh ? '官方考试科目' : 'Examination Subjects'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {isZh ? '选择科目即可开始模块练习或全真模考' : 'Select a subject to practice modules or launch a full exam'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('syllabus')}
            className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl border border-blue-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>{isZh ? '查看 2025 官方考试大纲' : '2025 Syllabus Explorer'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Spacious Image Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {subjects.map((subj) => {
            const syllabus = OFFICIAL_SYLLABI[subj];
            const stats = userProgress.subjectStats[subj] || { attempted: 0, correct: 0, highestScore: 0, testsTaken: 0 };
            const cardImg = subjectImages[subj];

            return (
              <div
                key={subj}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between transition-all hover:shadow-xl hover:border-slate-300 group"
              >
                {/* Visual Image Header (Generous height) */}
                <div className="relative h-52 sm:h-56 overflow-hidden">
                  <img
                    src={cardImg}
                    alt={subj}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent"></div>
                  
                  {/* Badges on Image */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-mono font-semibold border border-white/20 whitespace-nowrap">
                      {syllabus.code}
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-white/95 text-slate-900 text-xs font-bold shadow-md whitespace-nowrap">
                      {syllabus.durationMinutes} min · {syllabus.totalQuestions} Qs
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-black text-white tracking-tight">
                      {subj}
                    </h3>
                  </div>
                </div>

                {/* Card Content (Clean & Spacious) */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  {/* Clean Module Pills */}
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      {isZh ? '大纲考点模块' : 'Key Modules'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {syllabus.modules.map((m, mIdx) => (
                        <button
                          key={mIdx}
                          onClick={() => onStartQuiz('topic', subj, { moduleTitle: m.titleEn, count: 5 })}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 text-xs font-medium transition-colors"
                        >
                          {isZh ? m.titleZh : m.titleEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Minimal Stats */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>
                      {isZh ? '最高模考成绩: ' : 'Best Score: '}
                      <strong className="text-slate-900">{stats.highestScore || 0} / 100</strong>
                    </span>
                    <span>
                      {isZh ? '已完成: ' : 'Completed: '}
                      <strong className="text-slate-900">{stats.attempted} Qs</strong>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => onStartQuiz('mock', subj, { 
                        count: syllabus.totalQuestions, 
                        timeLimit: syllabus.durationMinutes * 60 
                      })}
                      className="flex-1 py-3.5 px-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{isZh ? `全真模考 (${syllabus.totalQuestions}题)` : `Full Mock Exam`}</span>
                    </button>

                    <button
                      onClick={() => onStartQuiz('topic', subj, { count: 5 })}
                      className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs sm:text-sm font-semibold transition-colors"
                    >
                      {isZh ? '专项 5 题' : '5-Q Drill'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: Official CSC Examination Schedule & Guidelines (Spacious & Minimal) */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg sm:text-xl">
                {isZh ? 'CSCA 2025-2026 考试指南' : 'CSCA Examination Guidelines'}
              </h3>
              <p className="text-xs text-slate-400">
                {isZh ? '国家留学基金委 (CSC) 官方日程与规则' : 'China Scholarship Council Official Notice'}
              </p>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 self-start sm:self-auto">
            {isZh ? '首考启动: 2025年12月21日' : 'Launch: Dec 21, 2025'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
            <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{isZh ? '开考时间 (UTC+8)' : 'Test Day Timetable (UTC+8)'}</span>
            </div>
            <ul className="space-y-2 text-slate-600">
              <li>• 专业汉语: 13:00 - 14:30 (90 min)</li>
              <li>• 数学: 15:30 - 16:30 (60 min)</li>
              <li>• 物理: 17:30 - 18:30 (60 min)</li>
              <li>• 化学: 19:30 - 20:30 (60 min)</li>
            </ul>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
            <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-cyan-600" />
              <span>{isZh ? '每年考试安排' : 'Annual Sessions'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {isZh 
                ? '每年常态化开展 5 次考试（1月、3月、4月、6月、12月），主要采用居家远程在线机考形式。'
                : '5 sessions annually (Jan, Mar, Apr, Jun, Dec). Conducted primarily via remote online CBT.'}
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
            <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>{isZh ? '奖学金要求与费用' : 'CGS Requirements & Fees'}</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {isZh 
                ? '中国政府奖学金必考：数学与专业汉语；选考：物理、化学。单科报名费 450 元，两科及以上 700 元。'
                : 'CGS Required: Mathematics & Chinese. Optional: Physics, Chemistry. 450 CNY for 1 subject, 700 CNY for 2+.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
