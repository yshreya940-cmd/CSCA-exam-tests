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
  ChevronDown,
  Layers
} from 'lucide-react';
import { Language, UserProgress, Subject } from '../types/csca';
import { CscaLogo } from './CscaLogo';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  lang: Language;
  onToggleLang: () => void;
  userProgress: UserProgress;
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  lang,
  onToggleLang,
  userProgress,
  onSearch,
}) => {
  const isZh = lang === 'zh';
  const [searchQuery, setSearchQuery] = useState('');
  const [isExploreOpen, setIsExploreOpen] = useState(false);

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
    <header className="sticky top-0 z-40 bg-white border-b border-[#d8f3dc] shadow-xs">
      {/* 1. Institutional Top Ribbon - Deep Evergreen / Pastel Mint Accent */}
      <div className="bg-[#122e22] text-[#d8f3dc] px-4 py-1.5 text-xs border-b border-[#0c2018]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Authority & CSCA by Apply for China */}
          <div className="flex items-center space-x-2 min-w-0">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#52b788] animate-pulse"></span>
            <span className="font-semibold text-white truncate text-[11px] sm:text-xs">
              {isZh 
                ? 'CSCA by Apply for China · 国家留学基金委 (CSC) CSCA 官方大纲全真机考系统' 
                : 'CSCA by Apply for China · China Scholarship Council (CSC) CSCA Official Portal'}
            </span>
            <span className="hidden lg:inline text-[#40916c]">|</span>
            <span className="hidden lg:inline text-[#b7e4c7] text-[11px] font-normal flex-shrink-0">
              {isZh ? '2025-2026 官方大纲与历年真题题库' : '2025-2026 Official Syllabus & Past Papers'}
            </span>
          </div>

          {/* Right: Candidate Info & Bilingual Switcher */}
          <div className="flex items-center space-x-3 flex-shrink-0 text-[11px]">
            <div className="hidden sm:flex items-center space-x-1.5 text-[#b7e4c7]">
              <UserCheck className="w-3.5 h-3.5 text-[#74c69d]" />
              <span className="font-mono text-white font-medium">{userProgress.candidateId}</span>
              <span className="text-[#95d5b2]">({userProgress.applicationType})</span>
            </div>

            <button
              onClick={onToggleLang}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#0c2018] hover:bg-[#183d2e] text-[#d8f3dc] border border-[#40916c]/40 transition-colors shadow-xs active:scale-95 cursor-pointer"
              title={isZh ? 'Switch to English' : '切换为中文'}
            >
              <Globe className="w-3.5 h-3.5 text-[#74c69d]" />
              <span className="font-semibold text-[11px]">{isZh ? 'English' : '中文'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar with Pastel Green Accents */}
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
                <span className="text-2xl font-black tracking-tight text-[#1b4332] font-sans group-hover:text-[#2d6a4f] transition-colors">
                  CSCA
                </span>
                <span className="text-[#74c69d] text-lg font-light">|</span>
                <span className="text-xs sm:text-sm font-bold tracking-tight text-[#2d6a4f] group-hover:text-[#1b4332] leading-none transition-colors">
                  by Apply for China
                </span>
              </div>
            </div>

            {/* "Explore" dropdown button in pastel green theme */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsExploreOpen(!isExploreOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#388e6c] text-[#2d6a4f] hover:bg-[#ecfdf5] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <span>{isZh ? '浏览科目' : 'Explore'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform text-[#388e6c] ${isExploreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isExploreOpen && (
                <div 
                  className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-[#d8f3dc] py-2 z-50 animate-in fade-in slide-in-from-top-1"
                  onMouseLeave={() => setIsExploreOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#40916c]">
                    {isZh ? '官方考试科目' : 'CSCA Subjects'}
                  </div>
                  {[
                    { name: 'Mathematics (高等数学)', subj: 'Mathematics' as Subject },
                    { name: 'Physics (大学物理)', subj: 'Physics' as Subject },
                    { name: 'Chemistry (基础化学)', subj: 'Chemistry' as Subject },
                    { name: 'Professional Chinese (专业汉语)', subj: 'Professional Chinese' as Subject },
                  ].map((item) => (
                    <button
                      key={item.subj}
                      onClick={() => {
                        setIsExploreOpen(false);
                        onTabChange('hub');
                      }}
                      className="w-full text-left px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-[#ecfdf5] hover:text-[#1b4332] transition-colors flex items-center justify-between"
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-[#74c69d]" />
                    </button>
                  ))}
                  <div className="border-t border-[#e8f5e9] my-1"></div>
                  <button
                    onClick={() => {
                      setIsExploreOpen(false);
                      onTabChange('syllabus');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#2d6a4f] font-semibold hover:bg-[#ecfdf5] flex items-center gap-2"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#388e6c]" />
                    <span>{isZh ? '查看 2025 官方完整大纲' : 'View Full 2025 Syllabus'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar - Pastel Green Accent */}
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
                className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm rounded-full border border-[#b7e4c7] focus:outline-none focus:border-[#388e6c] focus:ring-1 focus:ring-[#52b788] text-slate-800 placeholder-slate-400 transition-all bg-[#f9fdfa] focus:bg-white"
              />
              <Search className="w-4 h-4 text-[#74c69d] absolute left-3 top-2.5" />
              <button
                type="submit"
                className="w-7 h-7 rounded-full bg-[#388e6c] hover:bg-[#2d6a4f] text-white flex items-center justify-center absolute right-1.5 top-1.5 transition-colors cursor-pointer"
                title="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Clean Text Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3 flex-nowrap">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative px-2.5 py-2 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[#1b4332] border-b-2 border-[#2d6a4f]'
                      : 'text-slate-600 hover:text-[#2d6a4f]'
                  }`}
                >
                  <span>{isZh ? item.labelZh : item.shortEn}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-[#e63946] text-white text-[10px] font-bold rounded-full">
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
              <div className="w-8 h-8 rounded-full bg-[#388e6c] text-white font-bold text-xs flex items-center justify-center shadow-xs group-hover:bg-[#2d6a4f] transition-colors">
                CS
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {isZh ? '考生' : 'Candidate'}
                </span>
                <span className="text-[10px] text-[#40916c] leading-tight">
                  CSC Scholar
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mobile/Tablet Responsive Scrollable Navigation */}
      <div className="md:hidden border-t border-[#e8f5e9] bg-[#f9fdfa] px-3 py-2 overflow-x-auto scrollbar-none flex items-center space-x-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#2d6a4f] text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:bg-[#ecfdf5] bg-white border border-[#d8f3dc]'
              }`}
            >
              <span>{isZh ? item.labelZh : item.shortEn}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="ml-1 px-1 py-0.2 bg-[#e63946] text-white text-[9px] font-bold rounded-full">
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
