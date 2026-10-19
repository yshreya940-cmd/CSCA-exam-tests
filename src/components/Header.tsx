import React from 'react';
import { 
  BookOpen, 
  BarChart3, 
  Award, 
  Sparkles, 
  FileText, 
  Bookmark, 
  Globe, 
  UserCheck 
} from 'lucide-react';
import { Language, UserProgress } from '../types/csca';
import { CscaLogo } from './CscaLogo';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  lang: Language;
  onToggleLang: () => void;
  userProgress: UserProgress;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  lang,
  onToggleLang,
  userProgress,
}) => {
  const isZh = lang === 'zh';

  const navItems = [
    { 
      id: 'hub', 
      labelEn: 'Practice Hub', 
      labelZh: '练习首页', 
      shortEn: 'Hub',
      icon: BookOpen 
    },
    { 
      id: 'mock', 
      labelEn: 'Timed Mock Exam', 
      labelZh: '全真模考', 
      shortEn: 'Mock Exam',
      icon: Award 
    },
    { 
      id: 'progress', 
      labelEn: 'Progress & Analytics', 
      labelZh: '学情进度', 
      shortEn: 'Progress',
      icon: BarChart3 
    },
    { 
      id: 'syllabus', 
      labelEn: 'Syllabus', 
      labelZh: '考试大纲', 
      shortEn: 'Syllabus',
      icon: FileText 
    },
    { 
      id: 'ai-tutor', 
      labelEn: 'AI Practice & Tutor', 
      labelZh: 'AI 智能考题', 
      shortEn: 'AI Tutor',
      icon: Sparkles 
    },
    { 
      id: 'mistakes', 
      labelEn: 'Mistake Book', 
      labelZh: '错题本', 
      shortEn: 'Mistakes',
      icon: Bookmark, 
      badge: userProgress.mistakeBook.filter((m) => !m.resolved).length 
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c1e36] text-white border-b border-slate-800/80 shadow-lg backdrop-blur-md">
      {/* 1. CSC Institutional Top Micro-Bar */}
      <div className="bg-[#071322] px-4 py-1.5 border-b border-slate-800/60 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Authority & Status */}
          <div className="flex items-center space-x-2 min-w-0">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-200 truncate text-[11px] sm:text-xs">
              {isZh 
                ? '国家留学基金委 (CSC) · CSCA 官方大纲模拟测试系统' 
                : 'China Scholarship Council (CSC) · CSCA Exam Portal'}
            </span>
            <span className="hidden lg:inline text-slate-600">|</span>
            <span className="hidden lg:inline text-amber-300 text-[11px] font-semibold flex-shrink-0">
              {isZh ? '2025-2026 考试指南与真题支持' : '2025-2026 Official Syllabus & Past Papers'}
            </span>
          </div>

          {/* Right: Candidate Info & Bilingual Toggle */}
          <div className="flex items-center space-x-3 flex-shrink-0 text-[11px]">
            <div className="hidden sm:flex items-center space-x-1.5 text-slate-300">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-cyan-300 font-medium">{userProgress.candidateId}</span>
              <span className="text-slate-500">({userProgress.applicationType})</span>
            </div>

            <button
              onClick={onToggleLang}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors shadow-xs active:scale-95"
              title={isZh ? 'Switch to English' : '切换为中文'}
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-[11px]">{isZh ? 'English' : '中文'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Brand & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Name */}
          <div
            onClick={() => onTabChange('hub')}
            className="flex items-center space-x-3 cursor-pointer group flex-shrink-0 py-1"
          >
            <CscaLogo size="sm" />
            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-cyan-300 transition-colors whitespace-nowrap">
                  CSCA
                </span>
                <span className="px-1.5 py-0.2 text-[10px] uppercase font-bold rounded-md bg-blue-500/20 text-cyan-300 border border-blue-400/30 whitespace-nowrap">
                  {isZh ? '官方备考' : 'Prep Portal'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium leading-tight truncate max-w-[140px] sm:max-w-[210px] md:max-w-xs">
                {isZh ? '中国学术水平能力测试' : 'China Scholastic Competency'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 flex-nowrap overflow-x-hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span className="hidden xl:inline">{isZh ? item.labelZh : item.labelEn}</span>
                  <span className="xl:hidden">{isZh ? item.labelZh : item.shortEn}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-bold rounded-full shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 3. Mobile/Tablet Responsive Scrollable Sub-Navigation */}
      <div className="md:hidden border-t border-slate-800/80 bg-[#081525]/90 px-3 py-2 overflow-x-auto scrollbar-none flex items-center space-x-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 bg-slate-900/60 border border-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
              <span>{isZh ? item.labelZh : item.shortEn}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[9px] font-bold rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
