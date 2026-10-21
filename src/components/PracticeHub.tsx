import React from 'react';
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
  Star,
  Check,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';
import { Subject, Language, UserProgress } from '../types/csca';
import { OFFICIAL_SYLLABI } from '../data/syllabusData';

interface PracticeHubProps {
  onStartQuiz: (
    mode: 'daily' | 'topic' | 'mock', 
    subject: Subject | 'All', 
    options?: { count?: number; timeLimit?: number; moduleTitle?: string }
  ) => void;
  onNavigate: (tab: string) => void;
  lang: Language;
  userProgress: UserProgress;
}

export const PracticeHub: React.FC<PracticeHubProps> = ({
  onStartQuiz,
  onNavigate,
  lang,
  userProgress,
}) => {
  const isZh = lang === 'zh';
  const subjects: Subject[] = ['Mathematics', 'Physics', 'Chemistry', 'Chinese'];

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
      {/* 1. CSCA BY APPLY FOR CHINA HERO SECTION - Full Width Edge-to-Edge Canvas */}
      <section className="w-full bg-gradient-to-br from-[#f2f9f5] via-[#ecf7f1] to-[#e4f3ea] px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 border-b border-[#cbe8d8] relative overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#2d6a4f] tracking-wider uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-[#52b788]"></span>
              <span>{isZh ? 'CSCA by Apply for China · 官方全真备考平台' : 'CSCA by Apply for China · Official Platform'}</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#143828] leading-tight">
                {isZh 
                  ? '权威 CSCA 历年真题与全真机考' 
                  : 'CSCA Official Past Papers & CBT Simulation'}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {isZh 
                  ? '100% 还原官方真实考题与原卷题序，全真机考模拟与双语解析。' 
                  : '100% authentic past examination papers in exact question order, CBT exam simulation, and bilingual explanations.'}
              </p>
            </div>

            {/* Pastel Green CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('mock')}
                className="px-6 py-3.5 bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-semibold rounded-md text-sm shadow-xs flex items-center gap-2 transition-colors cursor-pointer active:scale-98"
              >
                <Award className="w-4 h-4 text-[#a7f3d0]" />
                <span>{isZh ? '进入历年真题库 (20套)' : 'Explore 20 Official Papers'}</span>
              </button>

              <button
                onClick={() => onStartQuiz('daily', 'All', { count: 10, timeLimit: 900 })}
                className="px-4 py-3.5 bg-[#d8f3dc] hover:bg-[#b7e4c7] text-[#1b4332] border border-[#74c69d] font-bold rounded-md text-sm shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer active:scale-98"
              >
                <Zap className="w-4 h-4 fill-[#1b4332]" />
                <span>{isZh ? '每日 10 题速练' : 'Daily 10-Q Drill'}</span>
              </button>
            </div>

            {/* Concise Trust and Key Stats row */}
            <div className="pt-3 border-t border-[#cbe8d8] flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1 text-[#1b4332] font-semibold">
                <Check className="w-4 h-4 text-[#388e6c]" />
                {isZh ? '真实考题原序' : 'Fact Question Order'}
              </span>
              <span aria-hidden="true" className="text-[#a7f3d0]">·</span>
              <span className="flex items-center gap-1 text-[#1b4332] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#388e6c]" />
                {isZh ? 'CSC 官方标准' : 'CSC Standards'}
              </span>
              <span aria-hidden="true" className="text-[#a7f3d0]">·</span>
              <span className="text-slate-600">
                {isZh ? '中英双语' : 'Bilingual EN/中文'}
              </span>
              <span aria-hidden="true" className="text-[#a7f3d0]">·</span>
              <span className="text-slate-600">
                {isZh ? '100分制机考' : '100-Pt CBT'}
              </span>
            </div>
          </div>

          {/* Right Image Showcase Card (5 cols) - Using user-attached Banner_c102f395.png */}
          {/* Right Image Showcase Card (5 cols) - Using user-attached Banner_c102f395.png */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden shadow-sm border border-[#cbe8d8] bg-white">
              <img
                src="/assets/aistudio/Banner_c102f395.png"
                alt="CSCA by Apply for China Examination Study Platform"
                className="w-full h-72 sm:h-80 object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Candidate Learning KPI Bar - Clean and Uncluttered */}
        <div className="mt-8 pt-6 border-t border-[#cbe8d8] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/80 rounded-xl p-4 border border-[#d8f3dc]">
            <div className="text-xs text-slate-500 font-medium">{isZh ? '累计做题' : 'Questions Practiced'}</div>
            <div className="text-2xl font-bold text-[#143828] mt-1 font-mono">
              {userProgress.totalQuestionsAttempted}
            </div>
          </div>

          <div className="bg-white/80 rounded-xl p-4 border border-[#d8f3dc]">
            <div className="text-xs text-slate-500 font-medium">{isZh ? '平均正确率' : 'Accuracy'}</div>
            <div className="text-2xl font-bold text-[#2d6a4f] mt-1 font-mono">
              {accuracy}%
            </div>
          </div>

          <div className="bg-white/80 rounded-xl p-4 border border-[#d8f3dc]">
            <div className="text-xs text-slate-500 font-medium">{isZh ? '完成模考' : 'Completed Exams'}</div>
            <div className="text-2xl font-bold text-[#143828] mt-1 font-mono">
              {userProgress.sessionsHistory.filter(s => s.isCompleted).length}
            </div>
          </div>

          <div className="bg-white/80 rounded-xl p-4 border border-[#d8f3dc]">
            <div className="text-xs text-slate-500 font-medium">{isZh ? '连续备考' : 'Study Streak'}</div>
            <div className="text-2xl font-bold text-[#2d6a4f] flex items-center gap-1.5 mt-1 font-mono">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>{userProgress.streakDays} {isZh ? '天' : 'days'}</span>
            </div>
          </div>
        </div>
      </section>


      {/* 3. SUBJECT CARDS SECTION - Full Width */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#143828] tracking-tight">
              {isZh ? '官方考核科目专项课程' : 'Explore CSCA Subjects'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {isZh 
                ? '包含历年官方真题、章节大纲考点、中英双语解析与全真机考模拟' 
                : 'Official past papers, syllabus breakdown, bilingual step-by-step derivations, and CBT simulation.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('syllabus')}
            className="text-xs sm:text-sm font-semibold text-[#2d6a4f] hover:text-[#1b4332] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>{isZh ? '查看 2025 官方考试大纲' : 'Explore All Syllabi'}</span>
            <ChevronRight className="w-4 h-4 text-[#388e6c]" />
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
                className="bg-white rounded-2xl border border-[#d8f3dc] overflow-hidden shadow-xs hover:border-[#52b788] hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Clean Course Image without floating badges */}
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
                    <div className="text-xs text-[#d8f3dc] font-medium mt-0.5">
                      {meta.titleZh}
                    </div>
                  </div>
                </div>

                {/* Clean Content Body */}
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
                  <div className="pt-4 border-t border-[#f0f9f4] flex items-center justify-between gap-4">
                    <div className="text-xs text-slate-500">
                      {stats.testsTaken > 0 ? (
                        <span>
                          {isZh ? '最佳: ' : 'Best: '} 
                          <strong className="text-[#2d6a4f] font-bold">{stats.highestScore}/100</strong>
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
                        className="py-2.5 px-3.5 bg-[#f0f9f4] hover:bg-[#d8f3dc] text-[#1b4332] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {isZh ? '5题练习' : 'Quick Drill'}
                      </button>

                      <button
                        onClick={() => onStartQuiz('mock', subj, { 
                          count: syllabus.totalQuestions, 
                          timeLimit: syllabus.durationMinutes * 60 
                        })}
                        className="py-2.5 px-4 bg-[#2d6a4f] hover:bg-[#1b4332] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer active:scale-98"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{isZh ? '开始真题模考' : 'Start Exam'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. WHY CSCA BY APPLY FOR CHINA (VALUE PROPOSITIONS) - Full Width */}
      <section className="w-full bg-white py-10 sm:py-12 px-4 sm:px-8 lg:px-12 xl:px-16 border-y border-[#d8f3dc] shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#143828]">
            {isZh ? '为什么选择 CSCA by Apply for China 备考平台？' : 'Why Prepare with CSCA by Apply for China'}
          </h2>
          <p className="text-sm text-slate-500">
            {isZh 
              ? '专门针对中国政府奖学金 (CSC) 申请者与来华留学本科生打造的官方对标平台' 
              : 'Engineered specifically for China Scholarship Council applicants and international scholars.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-lg border border-[#e1f3e8] bg-[#f7fbf8] space-y-3">
            <div className="w-10 h-10 rounded-md bg-[#d8f3dc] text-[#2d6a4f] flex items-center justify-center font-bold">
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

          <div className="p-5 rounded-lg border border-[#e1f3e8] bg-[#f7fbf8] space-y-3">
            <div className="w-10 h-10 rounded-md bg-[#d8f3dc] text-[#2d6a4f] flex items-center justify-center font-bold">
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

          <div className="p-5 rounded-lg border border-[#e1f3e8] bg-[#f7fbf8] space-y-3">
            <div className="w-10 h-10 rounded-md bg-[#d8f3dc] text-[#2d6a4f] flex items-center justify-center font-bold">
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

          <div className="p-5 rounded-lg border border-[#e1f3e8] bg-[#f7fbf8] space-y-3">
            <div className="w-10 h-10 rounded-md bg-[#d8f3dc] text-[#2d6a4f] flex items-center justify-center font-bold">
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

      {/* 5. LEARNING MODES GRID - Full Width */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-2xl font-bold text-[#143828] tracking-tight">
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
            className="group cursor-pointer bg-white p-6 rounded-2xl border border-[#d8f3dc] shadow-xs hover:border-[#52b788] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#f0f9f4] text-[#2d6a4f] flex items-center justify-center font-bold mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-medium text-slate-400 mb-1">
                {isZh ? '15 分钟速练' : '15 min drill'}
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-[#2d6a4f] transition-colors">
                {isZh ? '每日速练 10 题' : 'Daily 10-Q Drill'}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {isZh ? '跨科目高频考题精选，快速激活做题状态。' : '10 mixed questions across all subjects for rapid warm-up.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#f0f9f4] flex items-center text-xs font-semibold text-[#2d6a4f] gap-1">
              <span>{isZh ? '立即练习' : 'Start Drill'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Full Mock */}
          <div 
            onClick={() => onNavigate('mock')}
            className="group cursor-pointer bg-white p-6 rounded-2xl border border-[#d8f3dc] shadow-xs hover:border-[#52b788] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#f0f9f4] text-[#2d6a4f] flex items-center justify-center font-bold mb-4">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-medium text-slate-400 mb-1">
                {isZh ? '60/90 分钟全真' : '60/90 min exam'}
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-[#2d6a4f] transition-colors">
                {isZh ? '历年全真真题库' : 'Official Past Papers'}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {isZh ? '涵盖 20 套官方全真试卷，严格原卷题目顺序。' : '20 authentic papers in factual question order with real scoring.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#f0f9f4] flex items-center text-xs font-semibold text-[#2d6a4f] gap-1">
              <span>{isZh ? '进入真题考场' : 'Open Exam Room'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* AI Generator */}
          <div 
            onClick={() => onNavigate('ai-tutor')}
            className="group cursor-pointer bg-white p-6 rounded-2xl border border-[#d8f3dc] shadow-xs hover:border-[#52b788] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#f0f9f4] text-[#2d6a4f] flex items-center justify-center font-bold mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-medium text-slate-400 mb-1">
                {isZh ? '智能自适应' : 'Adaptive AI'}
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-[#2d6a4f] transition-colors">
                {isZh ? 'AI 弱项出题与答疑' : 'AI Adaptive Tutor'}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {isZh ? '针对薄弱考点生成个性化练习，双语深度拆解。' : 'Targeted questions based on weak modules with AI guidance.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#f0f9f4] flex items-center text-xs font-semibold text-[#2d6a4f] gap-1">
              <span>{isZh ? '体验智能辅导' : 'Explore AI'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Mistake Notebook */}
          <div 
            onClick={() => onNavigate('mistakes')}
            className="group cursor-pointer bg-white p-6 rounded-2xl border border-[#d8f3dc] shadow-xs hover:border-[#52b788] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#f0f9f4] text-[#2d6a4f] flex items-center justify-center font-bold mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-medium text-slate-400 mb-1">
                {userProgress.mistakeBook.filter(m => !m.resolved).length} {isZh ? '道待复习' : 'unresolved'}
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-[#2d6a4f] transition-colors">
                {isZh ? '错题本与弱项消灭' : 'Mistake Notebook'}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {isZh ? '自动归纳历次错题，逐题击破盲区，考前重练。' : 'Targeted review and re-drills of previously missed questions.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#f0f9f4] flex items-center text-xs font-semibold text-[#2d6a4f] gap-1">
              <span>{isZh ? '复习错题' : 'Review Missed'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. OFFICIAL CSC EXAMINATION SCHEDULE - Full Width */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pb-10">
        <div className="bg-white rounded-xl p-8 sm:p-10 border border-[#d8f3dc] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8f5e9] pb-5">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-md bg-[#eaf5ee] text-[#2d6a4f] flex items-center justify-center font-bold">
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

            <span className="px-3 py-1 rounded text-xs font-bold bg-[#eaf5ee] text-[#2d6a4f] border border-[#b7e4c7] self-start sm:self-auto">
              {isZh ? '首考启动: 2025年12月21日' : 'Launch: Dec 21, 2025'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
            <div className="bg-[#f7fbf8] p-5 rounded-lg border border-[#e1f3e8] space-y-2.5">
              <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-[#2d6a4f]" />
                <span>{isZh ? '单日考试时间表 (UTC+8)' : 'Test Day Timetable (UTC+8)'}</span>
              </div>
              <ul className="space-y-1.5 text-slate-600">
                <li>• {isZh ? '中文' : 'Chinese'}: 13:00 - 14:30 (90 min, 80题)</li>
                <li>• {isZh ? '数学' : 'Mathematics'}: 15:30 - 16:30 (60 min, 48题)</li>
                <li>• {isZh ? '物理' : 'Physics'}: 17:30 - 18:30 (60 min, 48题)</li>
                <li>• {isZh ? '化学' : 'Chemistry'}: 19:30 - 20:30 (60 min, 48题)</li>
              </ul>
            </div>

            <div className="bg-[#f7fbf8] p-5 rounded-lg border border-[#e1f3e8] space-y-2.5">
              <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-[#2d6a4f]" />
                <span>{isZh ? '每年考试频次与形式' : 'Annual Sessions & Format'}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {isZh 
                  ? '每年常态化开展 5 次考试（1月、3月、4月、6月、12月），采用居家远程在线机考 (CBT) 形式，双机位监考。'
                  : '5 sessions annually (Jan, Mar, Apr, Jun, Dec). Conducted primarily via remote online CBT with dual-camera proctoring.'}
              </p>
            </div>

            <div className="bg-[#f7fbf8] p-5 rounded-lg border border-[#e1f3e8] space-y-2.5">
              <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <FileCheck className="w-4 h-4 text-[#2d6a4f]" />
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
    </div>
  );
};
