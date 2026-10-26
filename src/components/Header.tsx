import React, { useState } from 'react';
import { 
  BookOpen, 
  BarChart3, 
  Award, 
  Sparkles, 
  FileText, 
  Bookmark, 
  Globe, 
  UserCheck,
  Search,
  Database
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { Language, UserProgress } from '../types/csca';
import { CscaLogo } from './CscaLogo';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  lang: Language;
  onToggleLang: () => void;
  userProgress: UserProgress;
  onSearch?: (query: string) => void;
  onOpenDatabaseGuide?: () => void;
  currentUser?: FirebaseUser | null;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  lang,
  onToggleLang,
  userProgress,
  onSearch,
  onOpenDatabaseGuide,
  currentUser,
  onOpenAuthModal,
}) => {
  const isZh = lang === 'zh';
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { 
      id: 'hub', 
      labelEn: 'Practice Hub', 
      labelZh: '学习首页', 
      shortEn: 'Home',
      icon: BookOpen 
    },
    { 
      id: 'mock', 
      labelEn: 'Official Papers & Mocks', 
      labelZh: '真题与模考', 
      shortEn: 'Past Papers',
      icon: Award 
    },
    { 
      id: 'progress', 
      labelEn: 'Progress & Analytics', 
      labelZh: '学情分析', 
      shortEn: 'Analytics',
      icon: BarChart3 
    },
    { 
      id: 'ai-tutor', 
      labelEn: 'AI Practice & Tutor', 
      labelZh: 'AI 辅导', 
      shortEn: 'AI Tutor',
      icon: Sparkles 
    },
    { 
      id: 'syllabus', 
      labelEn: 'Syllabus', 
      labelZh: '考试大纲', 
      shortEn: 'Syllabus',
      icon: FileText 
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    // Navigate to mock or hub if search performed
    if (searchQuery.trim()) {
      onTabChange('mock');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Institutional Top Ribbon - Signature Coursera Navy with Blue Accent */}
      <div className="bg-[#002554] text-blue-100 px-4 py-1.5 text-xs border-b border-[#001c40]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Authority & CSCA by Apply for China */}
          <div className="flex items-center space-x-2 min-w-0">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#0056D2] animate-pulse"></span>
            <span className="font-semibold text-white truncate text-[11px] sm:text-xs">
              {isZh 
                ? 'CSCA by Apply for China · 国家留学基金委 (CSC) CSCA 官方大纲全真机考系统' 
                : 'CSCA by Apply for China · China Scholarship Council (CSC) CSCA Official Portal'}
            </span>
            <span className="hidden lg:inline text-blue-400">|</span>
            <span className="hidden lg:inline text-blue-200 text-[11px] font-normal flex-shrink-0">
              {isZh ? '2025-2026 官方大纲与历年真题题库' : '2025-2026 Official Syllabus & Past Papers'}
            </span>
          </div>

          {/* Right: Candidate Info & Bilingual Switcher */}
          <div className="flex items-center space-x-2.5 flex-shrink-0 text-[11px]">
            <div className="hidden sm:flex items-center space-x-1.5 text-blue-200">
              <UserCheck className="w-3.5 h-3.5 text-blue-300" />
              <span className="font-mono text-white font-medium">{userProgress.candidateId}</span>
              <span className="text-blue-300">({userProgress.applicationType})</span>
            </div>

            {/* Login / Profile Button */}
            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition-colors shadow-xs active:scale-95 cursor-pointer border ${
                  currentUser
                    ? 'bg-blue-900/80 hover:bg-blue-800 text-sky-200 border-sky-400/40'
                    : 'bg-[#001c40] hover:bg-[#003366] text-white border-blue-400/40 font-semibold'
                }`}
                title={currentUser ? (isZh ? '考生考籍与云端档案' : 'Candidate Account') : (isZh ? '登录或注册' : 'Sign In')}
              >
                {currentUser ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span className="font-medium text-[11px] max-w-[130px] truncate">
                      {currentUser.displayName || currentUser.email?.split('@')[0]}
                    </span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-sky-300" />
                    <span>{isZh ? '邮箱登录' : 'Sign In'}</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onToggleLang}
              className="flex items-center space-x-1.5 px-2 py-1 rounded bg-[#001c40] hover:bg-[#003366] text-blue-100 border border-blue-400/30 transition-colors shadow-xs active:scale-95 cursor-pointer"
              title={isZh ? 'Switch to English' : '切换为中文'}
            >
              <Globe className="w-3.5 h-3.5 text-blue-300" />
              <span className="font-semibold text-[11px]">{isZh ? 'English' : '中文'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar - Classic Coursera Blue Theme without Explore Dropdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Brand Logo: CSCA by Apply for China */}
          <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
            <div
              onClick={() => onTabChange('hub')}
              className="flex items-center space-x-2.5 cursor-pointer group py-1"
            >
              <CscaLogo size="sm" className="hidden sm:flex" />
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-black tracking-tight text-[#0056D2] font-sans group-hover:text-[#00419e] transition-colors">
                  CSCA
                </span>
                <span className="text-slate-400 text-lg font-light">|</span>
                <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 group-hover:text-[#0056D2] leading-none transition-colors">
                  by Apply for China
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar - Clean Blue Theme */}
          <form 
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-md hidden lg:flex items-center relative"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isZh ? '搜索历年真题、科目模块或模拟试卷...' : 'What do you want to learn? (e.g. Mathematics, Past Papers)'}
                className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm rounded-full border border-slate-300 focus:outline-none focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] text-slate-800 placeholder-slate-400 transition-all bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <button
                type="submit"
                className="w-7 h-7 rounded-full bg-[#0056D2] hover:bg-[#00419e] text-white flex items-center justify-center absolute right-1.5 top-1.5 transition-colors cursor-pointer"
                title="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Clean Text Navigation Items - Coursera Blue Active State */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3 flex-nowrap">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative px-2.5 py-2 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[#0056D2] border-b-2 border-[#0056D2]'
                      : 'text-slate-600 hover:text-[#0056D2]'
                  }`}
                >
                  <span>{isZh ? item.labelZh : item.shortEn}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-[#0056D2] text-white text-[10px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile Avatar / Candidate Status */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div 
              onClick={() => onTabChange('progress')}
              className="flex items-center space-x-2 pl-2 cursor-pointer group"
              title="My Learning & Analytics"
            >
              <div className="w-8 h-8 rounded-full bg-[#0056D2] text-white font-bold text-xs flex items-center justify-center shadow-xs group-hover:bg-[#00419e] transition-colors">
                CS
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {isZh ? '考生' : 'Candidate'}
                </span>
                <span className="text-[10px] text-[#0056D2] leading-tight font-medium">
                  CSC Scholar
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mobile/Tablet Responsive Scrollable Navigation */}
      <div className="md:hidden border-t border-slate-200 bg-slate-50 px-3 py-2 overflow-x-auto scrollbar-none flex items-center space-x-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#0056D2] text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:bg-blue-50 bg-white border border-slate-200'
              }`}
            >
              <span>{isZh ? item.labelZh : item.shortEn}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="ml-1 px-1 py-0.2 bg-[#0056D2] text-white text-[9px] font-bold rounded-full">
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
